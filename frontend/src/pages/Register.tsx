import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuthStore } from '../app/store';
import { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/solid';

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional().or(z.literal("")),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function Register() {
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (form: RegisterForm) => {
    setError('');
    try {
      const user = await registerApi(form.name, form.email, form.password, form.phoneNumber);
      setUser(user);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg mb-4">
            <UserPlusIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Create an Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Join us to start sending and receiving gift cards instantly</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register('name')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-400' : 'border-blue-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-400' : 'border-blue-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder="Phone Number (optional)"
              {...register('phoneNumber')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.phoneNumber ? 'border-red-400' : 'border-blue-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              {...register('password')}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.password ? 'border-red-400' : 'border-blue-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:from-blue-600 hover:to-fuchsia-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-fuchsia-600 transition font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
