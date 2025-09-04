import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../app/store";
import api from "../../api/client";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      password: "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    if (!user?._id) {
      setApiError("User not authenticated");
      return;
    }
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const payload: any = {
        name: data.name,
        email: data.email,
      };
      if (data.phoneNumber?.trim()) {
        payload.phoneNumber = data.phoneNumber;
      }
      if (data.password?.trim()) {
        payload.password = data.password;
      }

      const response = await api.put(`/auth/users/${user._id}`, payload);

      const updatedUser = response.data;
      setUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      });

      setSuccessMessage("Profile updated successfully!");
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg mb-4">
            <UserCircleIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Edit Profile</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Update your information and manage your account details
          </p>
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-4 p-3 text-sm rounded-lg bg-red-100 text-red-700 text-center font-medium">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 text-sm rounded-lg bg-green-100 text-green-700 text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-semibold mb-1 text-slate-700">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? "border-red-400" : "border-blue-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-semibold mb-1 text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? "border-red-400" : "border-blue-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phoneNumber" className="block font-semibold mb-1 text-slate-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              {...register("phoneNumber")}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phoneNumber ? "border-red-400" : "border-blue-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-semibold mb-1 text-slate-700">
              New Password <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Leave blank to keep current password"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.password ? "border-red-400" : "border-blue-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
