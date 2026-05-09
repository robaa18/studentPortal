import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getAllUsers, getAnnouncements, getCourses, getGrades } from "../../services/admin.service";

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
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getCourses(), getGrades(), getAnnouncements()])
      .then(([userData, courseData, gradeData, announcementData]) => {
        setUsers(userData);
        setCourses(courseData);
        setGrades(gradeData);
        setAnnouncements(announcementData);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const students = users.filter((item) => Number(item.role) === 1);
    const avgGpa = students.length
      ? students.reduce((sum, item) => sum + (Number(item.gpa) || 0), 0) / students.length
      : 0;

    return {
      students,
      avgGpa,
      activeStudents: students.filter((item) => item.status === "active").length,
    };
  }, [users]);

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Welcome, <span className="text-indigo-600">{user?.userName || "Admin"}</span>
        </h2>
        <p className="text-gray-400 mt-1 text-sm">This overview is loaded from the backend API.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.students.length} sub="Enrolled" onClick={() => navigate("/admin/students")} />
        <StatCard label="Total Courses" value={courses.length} sub="Available" onClick={() => navigate("/admin/courses")} />
        <StatCard label="Posted Grades" value={grades.length} sub="Grade records" />
        <StatCard label="Average GPA" value={stats.avgGpa.toFixed(2)} sub={`${stats.activeStudents} active students`} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Students</h3>
            <button onClick={() => navigate("/admin/students")} className="text-sm text-indigo-600 font-semibold">Manage All</button>
          </div>
          <div className="space-y-2">
            {stats.students.slice(0, 5).map((student) => (
              <div key={student._id} className="grid grid-cols-12 items-center px-4 py-4 rounded-2xl bg-[#F5F3FF]">
                <span className="col-span-5 font-bold text-gray-800">{student.firstName} {student.lastName}</span>
                <span className="col-span-4 text-sm text-gray-500">{student.major}</span>
                <span className="col-span-3 text-right font-bold text-indigo-600">{Number(student.gpa || 0).toFixed(2)}</span>
              </div>
            ))}
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
