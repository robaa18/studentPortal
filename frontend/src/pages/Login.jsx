import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { loginApi } from "../services/authservice";

const schema = z.object({
  userName: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

const getDashboardPath = (user) =>
  user?.roleName === "admin" || user?.role === 0
    ? "/admin/dashboard"
    : "/student/dashboard";

export default function Login() {
  const { login, user, token } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (token && user) {
      navigate(getDashboardPath(user), { replace: true });
    }
  }, [token, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const authData = await loginApi(data);
      login(authData);
      toast.success("Login successful");
      navigate(getDashboardPath(authData.user), { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#fcf8ff]">
      <section className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-l from-[#4b41e1] to-[#645efb]">
        <div className="relative z-10 flex flex-col items-center justify-center p-16 text-center">
          <h2 className="text-4xl font-extrabold text-white mt-10">
            StudentPortal
          </h2>
          <p className="text-indigo-100 mt-4 max-w-sm">
            Manage students, courses, grades, schedules, and announcements from one local full-stack app.
          </p>
          <div className="mt-8 grid gap-3 text-left text-sm text-white/90">
            <div className="rounded-xl bg-white/15 px-4 py-3">
              Admin demo: <strong>admin</strong> / <strong>admin123</strong>
            </div>
            <div className="rounded-xl bg-white/15 px-4 py-3">
              Student demo: <strong>student</strong> / <strong>student123</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center p-8 md:p-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-indigo-50">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-indigo-600">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in with your seeded local account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register("userName")}
                placeholder="Username"
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.userName && (
                <p className="text-sm text-red-500 mt-1">{errors.userName.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-indigo-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
