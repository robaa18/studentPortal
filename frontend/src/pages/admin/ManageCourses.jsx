import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../../services/admin.service";

const emptyForm = {
  title: "",
  code: "",
  credits: 3,
  capacity: 30,
  section: "A",
};

function CourseModal({ course, onClose, onSave }) {
  const isEdit = Boolean(course);
  const [form, setForm] = useState(() => ({ ...emptyForm, ...course }));
  const [saving, setSaving] = useState(false);
  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!form.title || !form.code) {
      toast.error("Course title and code are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        code: form.code,
        section: form.section,
        credits: Number(form.credits) || 0,
        capacity: Number(form.capacity) || 1,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Course" : "Add New Course"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100">x</button>
        </div>

        <div className="space-y-4">
          {[
            ["title", "Course Name", "text"],
            ["code", "Course Code", "text"],
            ["section", "Section", "text"],
            ["credits", "Credits", "number"],
            ["capacity", "Capacity", "number"],
          ].map(([key, label, type]) => (
            <label key={key} className="space-y-1.5 block">
              <span className="text-sm font-semibold text-gray-500">{label}</span>
              <input
                type={type}
                value={form[key] ?? ""}
                onChange={(event) => setValue(key, event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>
          ))}
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

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalCourse, setModalCourse] = useState(undefined);

  const load = async () => setCourses(await getCourses());

  useEffect(() => {
    load()
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((course) => `${course.title} ${course.code}`.toLowerCase().includes(q));
  }, [courses, search]);

  const saveCourse = async (payload) => {
    try {
      if (modalCourse?._id) {
        await updateCourse(modalCourse._id, payload);
        toast.success("Course updated");
      } else {
        await createCourse(payload);
        toast.success("Course added");
      }
      setModalCourse(undefined);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save course");
    }
  };

  const removeCourse = async (course) => {
    if (!window.confirm(`Delete ${course.title}?`)) return;
    try {
      await deleteCourse(course._id);
      toast.info("Course deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete course");
    }
  };

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;

  return (
    <>
      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Curriculum Administration</h2>
            <p className="text-sm text-gray-400">Create, edit, and remove courses through the backend API.</p>
          </div>
          <button onClick={() => setModalCourse(null)} className="px-6 py-3 rounded-full text-white bg-indigo-600 font-bold">
            Add Course
          </button>
        </section>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search courses..."
          className="w-full max-w-sm px-5 py-3 rounded-full bg-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-4 border-b border-gray-50 text-[11px] font-bold tracking-widest uppercase text-gray-400">
            <span className="col-span-4">Course Name</span>
            <span className="col-span-2">Code</span>
            <span className="col-span-2">Credits</span>
            <span className="col-span-2">Capacity</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {filtered.map((course) => (
            <div key={course._id} className="grid grid-cols-12 items-center px-8 py-5 hover:bg-[#F5F3FF]/60">
              <span className="col-span-4 font-bold text-gray-800">{course.title}</span>
              <span className="col-span-2 text-xs font-mono text-gray-500">{course.code}</span>
              <span className="col-span-2 text-sm text-gray-700">{course.credits}</span>
              <span className="col-span-2 text-sm text-gray-700">{course.enrolledCount || 0} / {course.capacity || 0}</span>
              <div className="col-span-2 flex justify-end gap-2">
                <button onClick={() => setModalCourse(course)} className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-semibold">Edit</button>
                <button onClick={() => removeCourse(course)} className="px-3 py-2 rounded-xl bg-red-50 text-red-500 font-semibold">Delete</button>
              </div>
            </div>
          ))}

          {!filtered.length && <div className="text-center py-16 text-gray-400">No courses found.</div>}
        </div>
      </div>

      {modalCourse !== undefined && (
        <CourseModal course={modalCourse} onClose={() => setModalCourse(undefined)} onSave={saveCourse} />
      )}
    </>
  );
}
