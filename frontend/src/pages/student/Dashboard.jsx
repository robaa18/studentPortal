import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAnnouncements, getMyCourses, getMyGrades } from "../../services/studentservice";

const gradePoints = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, D: 1, F: 0 };

function StatCard({ label, value, sub, accent, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl p-6 min-h-[130px] shadow-sm transition ${onClick ? "hover:scale-[1.02]" : ""}`}
      style={{ background: accent ? "linear-gradient(135deg,#5147e8,#6c66f5)" : "#fff" }}
    >
      <span className={`text-sm font-semibold ${accent ? "text-white/80" : "text-gray-400"}`}>{label}</span>
      <p className={`text-4xl font-extrabold mt-3 ${accent ? "text-white" : "text-gray-800"}`}>{value}</p>
      {sub && <p className={`text-sm mt-1 ${accent ? "text-white/70" : "text-gray-400"}`}>{sub}</p>}
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyCourses(), getMyGrades(), getAnnouncements()])
      .then(([courseData, gradeData, announcementData]) => {
        setCourses(courseData);
        setGrades(gradeData);
        setAnnouncements(announcementData);
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const credits = grades.reduce((sum, item) => sum + (Number(item.course?.credits) || 0), 0);
    const points = grades.reduce((sum, item) => {
      const courseCredits = Number(item.course?.credits) || 0;
      return sum + ((gradePoints[item.grade] ?? 0) * courseCredits);
    }, 0);

    return {
      gpa: credits ? (points / credits).toFixed(2) : "0.00",
      credits,
      activeCourses: courses.length,
      totalCredits: user?.creditsTotal || 120,
    };
  }, [courses.length, grades, user?.creditsTotal]);

  if (loading) {
    return <div className="h-80 rounded-2xl bg-[#EEEDF4] animate-pulse" />;
  }

  if (error) {
    return <div className="bg-white rounded-2xl p-8 text-red-500">{error}</div>;
  }

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.userName;
  const progress = Math.min(100, Math.round((stats.credits / stats.totalCredits) * 100));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Welcome back, {displayName || "Student"}
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Here is your live academic snapshot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Cumulative GPA" value={stats.gpa} sub="From posted grades" onClick={() => navigate("/student/grades")} />
        <StatCard label="Credits Earned" value={stats.credits} sub={`/ ${stats.totalCredits} required`} onClick={() => navigate("/student/grades")} />
        <StatCard label="Active Courses" value={stats.activeCourses} sub="Current enrollments" onClick={() => navigate("/student/courses")} />
        <StatCard label="Account Status" value={user?.status || "active"} sub={user?.email} accent />
      </div>

      <section className="bg-white rounded-2xl px-8 py-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-600">Degree Progress</span>
          <span className="text-sm font-bold text-indigo-600">{progress}% Complete</span>
        </div>
        <div className="w-full bg-[#EEEDF4] h-3 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-indigo-600 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">My Enrolled Courses</h3>
            <button onClick={() => navigate("/student/courses")} className="text-sm text-indigo-600 font-semibold">View All</button>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 4).map((enrollment) => (
              <div key={enrollment._id} className="p-4 rounded-2xl bg-[#F5F3FF]">
                <p className="font-bold text-gray-800">{enrollment.course?.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {enrollment.course?.code} | {enrollment.course?.credits || 0} credits
                </p>
              </div>
            ))}
            {!courses.length && <p className="text-center text-gray-400 py-8">No enrolled courses yet.</p>}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Announcements</h3>
          <div className="space-y-4">
            {announcements.slice(0, 4).map((item) => (
              <div key={item._id} className="border-l-4 border-indigo-400 pl-4">
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">{item.content}</p>
              </div>
            ))}
            {!announcements.length && <p className="text-center text-gray-400 py-8">No announcements yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
