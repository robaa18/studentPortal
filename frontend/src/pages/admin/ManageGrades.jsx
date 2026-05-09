import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getGrades, deleteGrade, uploadStudentGrade, getAllUsers, getCourses } from "../../services/admin.service";

const GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

function GradeModal({ gradeRecord, students, courses, onClose, onSave }) {
  const isEdit = Boolean(gradeRecord);
  const [form, setForm] = useState(() => ({
    student: gradeRecord?.student?._id || "",
    course: gradeRecord?.course?._id || "",
    grade: gradeRecord?.grade || "A",
    score: gradeRecord?.score || 0,
  }));
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.student || !form.course || !form.grade) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        score: Number(form.score) || 0,
      });
    } finally {
      setSaving(false);
    }
  };

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Grade" : "Assign Grade"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100">x</button>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-semibold text-gray-500">Student</span>
            <select
              value={form.student}
              onChange={(e) => setValue("student", e.target.value)}
              disabled={isEdit}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-70"
            >
              <option value="">Select a student...</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName} ({s.studentID || s.studentId || "No ID"})
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-semibold text-gray-500">Course</span>
            <select
              value={form.course}
              onChange={(e) => setValue("course", e.target.value)}
              disabled={isEdit}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-70"
            >
              <option value="">Select a course...</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-semibold text-gray-500">Letter Grade</span>
            <select
              value={form.grade}
              onChange={(e) => setValue("grade", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-semibold text-gray-500">Score (Numeric)</span>
            <input
              type="number"
              value={form.score}
              onChange={(e) => setValue("score", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300"
              min="0" max="100"
            />
          </label>
        </div>

        <div className="flex gap-3 mt-8">
          <button disabled={saving} onClick={submit} className="flex-1 py-3 rounded-full text-white bg-indigo-600 font-bold disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-indigo-200 text-indigo-600 font-bold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageGrades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalGrade, setModalGrade] = useState(undefined);

  const load = async () => {
    const [gradesData, usersData, coursesData] = await Promise.all([
      getGrades(),
      getAllUsers(),
      getCourses(),
    ]);
    setGrades(gradesData);
    setStudents(usersData.filter((u) => Number(u.role) === 1));
    setCourses(coursesData);
  };

  useEffect(() => {
    load()
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return grades.filter((g) => {
      const studentName = `${g.student?.firstName || ""} ${g.student?.lastName || ""}`.toLowerCase();
      const studentId = (g.student?.studentID || "").toLowerCase();
      const courseTitle = (g.course?.title || "").toLowerCase();
      const courseCode = (g.course?.code || "").toLowerCase();
      return studentName.includes(q) || studentId.includes(q) || courseTitle.includes(q) || courseCode.includes(q);
    });
  }, [search, grades]);

  const handleSave = async (payload) => {
    try {
      await uploadStudentGrade(payload);
      toast.success("Grade saved successfully");
      setModalGrade(undefined);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save grade");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this grade?")) return;
    try {
      await deleteGrade(id);
      toast.success("Grade deleted successfully");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete grade");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grades Ledger</h2>
          <p className="text-gray-400 text-sm">Manage student course grades</p>
        </div>
        <button
          onClick={() => setModalGrade(null)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-200"
        >
          Assign Grade
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by student, ID, or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 mb-6 px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
      />

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 font-semibold text-gray-400 text-sm">Student</th>
                <th className="py-4 px-4 font-semibold text-gray-400 text-sm">Course</th>
                <th className="py-4 px-4 font-semibold text-gray-400 text-sm">Grade</th>
                <th className="py-4 px-4 font-semibold text-gray-400 text-sm">Score</th>
                <th className="py-4 px-4 font-semibold text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g._id} className="border-b border-gray-50 hover:bg-[#F8F7FF] transition-colors group">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-800">
                      {g.student?.firstName} {g.student?.lastName}
                    </div>
                    <div className="text-xs text-gray-400">{g.student?.studentID || g.student?.studentId}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    <span className="font-semibold">{g.course?.code}</span> - {g.course?.title}
                  </td>
                  <td className="py-4 px-4 font-bold text-indigo-600">{g.grade}</td>
                  <td className="py-4 px-4 text-gray-500">{g.score || "-"}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModalGrade(g)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(g._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No grades found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalGrade !== undefined && (
        <GradeModal
          gradeRecord={modalGrade}
          students={students}
          courses={courses}
          onClose={() => setModalGrade(undefined)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
