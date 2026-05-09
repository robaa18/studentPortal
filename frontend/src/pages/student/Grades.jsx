import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getMyGrades } from "../../services/studentservice";

const gradePoints = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, D: 1, F: 0 };

const gradeColor = (grade) => {
  if (!grade) return "text-gray-400";
  if (grade.startsWith("A")) return "text-indigo-600";
  if (grade.startsWith("B")) return "text-purple-500";
  return "text-gray-600";
};

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGrades()
      .then(setGrades)
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load grades"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const credits = grades.reduce((sum, item) => sum + (Number(item.course?.credits) || 0), 0);
    const weighted = grades.reduce((sum, item) => {
      const creditsForCourse = Number(item.course?.credits) || 0;
      return sum + ((gradePoints[item.grade] ?? 0) * creditsForCourse);
    }, 0);
    const gpa = credits ? weighted / credits : 0;
    return {
      gpa,
      credits,
      standing: gpa >= 3.5 ? "Dean's List" : "Good Standing",
    };
  }, [grades]);

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-2">Cumulative GPA</p>
          <p className="text-4xl font-extrabold text-gray-800">{stats.gpa.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-2">Credits Graded</p>
          <p className="text-4xl font-extrabold text-gray-800">{stats.credits}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-2">Academic Standing</p>
          <p className="text-2xl font-extrabold text-gray-800">{stats.standing}</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <p className="text-sm text-white/70 font-medium">Records</p>
          <p className="text-4xl font-extrabold">{grades.length}</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Course Academic Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-gray-400">
                <th className="py-3">Course</th>
                <th className="py-3">Code</th>
                <th className="py-3">Credits</th>
                <th className="py-3 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grades.map((item) => (
                <tr key={item._id}>
                  <td className="py-5 font-bold text-gray-800">{item.course?.title || "Course"}</td>
                  <td className="py-5 text-gray-500">{item.course?.code || "N/A"}</td>
                  <td className="py-5 text-gray-700">{Number(item.course?.credits || 0).toFixed(1)}</td>
                  <td className={`py-5 text-right text-2xl font-extrabold ${gradeColor(item.grade)}`}>{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!grades.length && <div className="text-center py-16 text-gray-400">No grades available yet.</div>}
        </div>
      </section>
    </div>
  );
}
