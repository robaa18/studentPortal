import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { addUser, deleteUser, getAllUsers, updateUser } from "../../services/admin.service";

const emptyForm = {
  firstName: "",
  lastName: "",
  studentID: "",
  academicLevel: "Level 4",
  email: "",
  phoneNumber: "",
  userName: "",
  password: "",
  major: "Computer Science",
  gpa: 0,
  status: "active",
};

function StudentModal({ student, onClose, onSave }) {
  const isEdit = Boolean(student);
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...student,
    studentID: student?.studentID || student?.studentId || "",
    password: "",
  }));
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.studentID || !form.email || !form.userName || (!isEdit && !form.password)) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        studentID: form.studentID,
        academicLevel: form.academicLevel,
        email: form.email,
        phoneNumber: form.phoneNumber,
        userName: form.userName,
        major: form.major,
        role: 1,
        gpa: Number(form.gpa) || 0,
        status: form.status,
      };
      if (form.password) payload.password = form.password;
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Student" : "Add New Student"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100">x</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["firstName", "First Name"],
            ["lastName", "Last Name"],
            ["studentID", "Student ID"],
            ["academicLevel", "Academic Level"],
            ["email", "Email"],
            ["phoneNumber", "Phone"],
            ["userName", "Username"],
            ["major", "Major"],
            ["gpa", "GPA"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-1">
              <span className="text-sm font-semibold text-gray-500">{label}</span>
              <input
                type={key === "gpa" ? "number" : "text"}
                value={form[key] ?? ""}
                onChange={(event) => setValue(key, event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>
          ))}

          <label className="space-y-1">
            <span className="text-sm font-semibold text-gray-500">{isEdit ? "New Password" : "Password"}</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setValue("password", event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-semibold text-gray-500">Status</span>
            <select
              value={form.status}
              onChange={(event) => setValue("status", event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="inactive">Inactive</option>
            </select>
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

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalStudent, setModalStudent] = useState(undefined);

  const load = async () => {
    const users = await getAllUsers();
    setStudents(users.filter((user) => Number(user.role) === 1));
  };

  useEffect(() => {
    load()
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((student) =>
      `${student.firstName} ${student.lastName} ${student.studentID} ${student.email} ${student.major}`.toLowerCase().includes(q)
    );
  }, [search, students]);

  const saveStudent = async (payload) => {
    try {
      if (modalStudent?._id) {
        await updateUser(modalStudent._id, payload);
        toast.success("Student updated");
      } else {
        await addUser(payload);
        toast.success("Student added");
      }
      setModalStudent(undefined);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save student");
    }
  };

  const removeStudent = async (student) => {
    if (!window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) return;
    try {
      await deleteUser(student._id);
      toast.info("Student deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete student");
    }
  };

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;

  return (
    <>
      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Student Administration</h2>
            <p className="text-sm text-gray-400">Create, update, and delete real student records through the API.</p>
          </div>
          <button onClick={() => setModalStudent(null)} className="px-6 py-3 rounded-full text-white bg-indigo-600 font-bold">
            Add Student
          </button>
        </section>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search students..."
          className="w-full max-w-sm px-5 py-3 rounded-full bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-4 border-b border-gray-50 text-[11px] font-bold tracking-widest uppercase text-gray-400">
            <span className="col-span-3">Student</span>
            <span className="col-span-2">Student ID</span>
            <span className="col-span-3">Major</span>
            <span className="col-span-1">GPA</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {filtered.map((student) => (
            <div key={student._id} className="grid grid-cols-12 items-center px-8 py-5 hover:bg-[#F5F3FF]/60">
              <div className="col-span-3">
                <p className="font-bold text-gray-800">{student.firstName} {student.lastName}</p>
                <p className="text-xs text-gray-400">{student.email}</p>
              </div>
              <span className="col-span-2 text-xs font-mono text-gray-500">{student.studentID}</span>
              <span className="col-span-3 text-sm text-gray-600">{student.major}</span>
              <span className="col-span-1 font-bold text-indigo-600">{Number(student.gpa || 0).toFixed(2)}</span>
              <span className="col-span-1 text-xs font-bold text-green-600 uppercase">{student.status}</span>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => setModalStudent(student)} className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-semibold">Edit</button>
                <button onClick={() => removeStudent(student)} className="px-3 py-2 rounded-xl bg-red-50 text-red-500 font-semibold">Delete</button>
              </div>
            </div>
          ))}

          {!filtered.length && <div className="text-center py-16 text-gray-400">No students found.</div>}
        </div>
      </div>

      {modalStudent !== undefined && (
        <StudentModal student={modalStudent} onClose={() => setModalStudent(undefined)} onSave={saveStudent} />
      )}
    </>
  );
}
