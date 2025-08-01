import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../app/store";
import api from "../../api/client";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .optional()
    .or(z.literal("")),
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
      password: "", // keep blank initially
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
      if (data.phoneNumber && data.phoneNumber.trim() !== '') {
        payload.phoneNumber = data.phoneNumber;
      }
      if (data.password && data.password.trim() !== "") {
        payload.password = data.password;
      }
  
      // Update user profile via new endpoint
      const response = await api.put(`/auth/users/${user._id}`, payload);
  
      const updatedUser = response.data;
      setUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        // Keep token as before, or update if returned
      });
  
      setSuccessMessage("Profile updated successfully!");
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-12">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {apiError && <p className="text-red-600 mb-4">{apiError}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            disabled={loading}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.name ? "border-red-600" : "border-gray-300"
              }`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled={loading}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.email ? "border-red-600" : "border-gray-300"
              }`}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block font-semibold mb-1">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            {...register('phoneNumber')}
            // placeholder="Phone Number (optional)"
            disabled={loading}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.phoneNumber ? "border-red-600" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold mb-1">
            New Password (optional)
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Leave blank to keep current password"
            disabled={loading}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.password ? "border-red-600" : "border-gray-300"
              }`}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
