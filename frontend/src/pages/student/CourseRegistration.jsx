import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { enrollInCourse, getCourses, getMyCourses, withdrawFromCourse } from "../../services/studentservice";

export default function CourseRegistration() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const load = async () => {
    const [allCourses, myCourses] = await Promise.all([getCourses(), getMyCourses()]);
    setCourses(allCourses);
    setEnrollments(myCourses);
  };

  useEffect(() => {
    load()
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((item) => String(item.course?._id || item.course))),
    [enrollments]
  );

  const creditLoad = enrollments.reduce((sum, item) => sum + (Number(item.course?.credits) || 0), 0);
  const maxCredits = 18;

  const handleEnroll = async (courseId) => {
    setBusy(courseId);
    try {
      await enrollInCourse(courseId);
      await load();
      toast.success("Course registered");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to register");
    } finally {
      setBusy("");
    }
  };

  const handleWithdraw = async (courseId) => {
    setBusy(courseId);
    try {
      await withdrawFromCourse(courseId);
      await load();
      toast.info("Course dropped");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to drop course");
    } finally {
      setBusy("");
    }
  };

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;

  const creditPercent = Math.min(100, Math.round((creditLoad / maxCredits) * 100));

  return (
    <div className="space-y-6">
      <section className="rounded-2xl p-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold uppercase inline-block mb-4">
              Registration Open
            </span>
            <h2 className="text-4xl font-extrabold">Current Semester</h2>
            <p className="text-white/80 mt-2">Register and drop courses through the local backend API.</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-bold opacity-70 uppercase mb-1">Credit Load</p>
            <p className="text-5xl font-extrabold">{creditLoad} <span className="text-2xl opacity-60">/ {maxCredits}</span></p>
            <div className="w-40 h-2 bg-white/25 rounded-full overflow-hidden mt-3 md:ml-auto">
              <div className="h-full bg-white rounded-full" style={{ width: `${creditPercent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl px-8 py-6 shadow-sm">
        <h3 className="text-2xl font-bold text-indigo-900 mb-6">Available Courses</h3>

        <div className="space-y-3">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(String(course._id));
            const enrolledCount = course.enrolledCount || 0;
            const isFull = course.capacity && enrolledCount >= course.capacity && !isEnrolled;

            return (
              <div key={course._id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-4 py-4 rounded-2xl bg-[#F5F3FF]">
                <div className="lg:col-span-5">
                  <p className="font-bold text-indigo-900">{course.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{course.code} | Section {course.section || "A"}</p>
                </div>
                <div className="lg:col-span-3 text-sm text-gray-600">
                  {course.instructor?.firstName ? `${course.instructor.firstName} ${course.instructor.lastName || ""}` : course.instructor?.userName || "Unassigned"}
                </div>
                <div className="lg:col-span-1 font-bold text-gray-800">{course.credits || 0}</div>
                <div className="lg:col-span-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isEnrolled ? "bg-green-100 text-green-700" : isFull ? "bg-red-100 text-red-500" : "bg-indigo-100 text-indigo-600"}`}>
                    {isEnrolled ? "REGISTERED" : isFull ? "FULL" : "OPEN"}
                  </span>
                </div>
                <div className="lg:col-span-2 flex lg:justify-end">
                  {isEnrolled ? (
                    <button
                      onClick={() => handleWithdraw(course._id)}
                      disabled={busy === course._id}
                      className="text-red-500 font-bold text-sm hover:underline disabled:opacity-50"
                    >
                      {busy === course._id ? "Dropping..." : "Drop"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={isFull || busy === course._id}
                      className="px-6 py-2 rounded-full text-white bg-indigo-600 font-bold text-sm disabled:opacity-50"
                    >
                      {busy === course._id ? "Registering..." : "Register"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {!courses.length && <div className="text-center py-16 text-gray-400">No courses available.</div>}
        </div>
      </section>
    </div>
  );
}
