import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/studentservice";

const schema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-600 pl-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs pl-2">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        });
      })
      .catch((err) => toast.error(err?.response?.data?.message || err?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (!payload.dateOfBirth) delete payload.dateOfBirth;
      const updated = await updateProfile(payload);
      setProfile(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Update failed");
    }
  };

  if (loading) return <div className="h-96 rounded-2xl bg-[#EEEDF4] animate-pulse" />;
  if (!profile) return <div className="bg-white rounded-2xl p-8 text-gray-500">Profile not found.</div>;

  const displayName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.userName;
  const progress = Math.min(100, Math.round(((profile.creditsEarned || 0) / (profile.creditsTotal || 120)) * 100));
  const inputClass = "w-full px-5 py-3 rounded-full border-none outline-none text-[15px] bg-[#E8E6F0] text-gray-800 focus:ring-2 focus:ring-indigo-300 disabled:bg-[#EEEDF4] disabled:text-gray-500";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <section className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold">
          {displayName[0]?.toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-6">{displayName}</h2>
        <p className="text-indigo-600 font-medium">{profile.major}</p>
        <p className="text-gray-400 text-sm mt-1">{profile.studentID || profile.studentId}</p>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-6 w-full text-white py-3 rounded-full font-semibold bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          Edit Profile
        </button>
      </section>

      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Academic Standing</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-sm font-bold text-green-600">{profile.status || "active"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Current GPA</span>
            <span className="text-xl font-bold text-gray-800">{Number(profile.gpa || 0).toFixed(2)}</span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Credits Earned</span>
              <span>{profile.creditsEarned || 0} / {profile.creditsTotal || 120}</span>
            </div>
            <div className="w-full bg-[#EEEDF4] h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="lg:col-span-3 bg-white rounded-2xl p-10 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
            <p className="text-gray-400 text-sm">Data is loaded and saved through the backend API.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="First Name" error={errors.firstName?.message}>
              <input {...register("firstName")} disabled={!isEditing} className={inputClass} />
            </Field>
            <Field label="Last Name" error={errors.lastName?.message}>
              <input {...register("lastName")} disabled={!isEditing} className={inputClass} />
            </Field>
            <Field label="Student ID">
              <input value={profile.studentID || profile.studentId || ""} disabled readOnly className={inputClass} />
            </Field>
            <Field label="Academic Level">
              <input value={profile.academicLevel || ""} disabled readOnly className={inputClass} />
            </Field>
            <Field label="Email Address" error={errors.email?.message}>
              <input type="email" {...register("email")} disabled={!isEditing} className={inputClass} />
            </Field>
            <Field label="Phone Number" error={errors.phoneNumber?.message}>
              <input {...register("phoneNumber")} disabled={!isEditing} className={inputClass} />
            </Field>
            <Field label="Major">
              <input value={profile.major || ""} disabled readOnly className={inputClass} />
            </Field>
            <Field label="Date of Birth">
              <input type="date" {...register("dateOfBirth")} disabled={!isEditing} className={inputClass} />
            </Field>
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <button disabled={isSubmitting} className="flex-1 text-white py-3 rounded-full font-semibold bg-indigo-600">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-full border border-indigo-200 text-indigo-600 font-semibold">
                Cancel
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
