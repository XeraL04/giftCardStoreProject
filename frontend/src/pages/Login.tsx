import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuthStore } from '../app/store';
import { ArrowRightOnRectangleIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (form: LoginForm) => {
    setError('');
    try {
      const user = await loginApi(form.email, form.password);
      setUser(user);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg mb-4">
            <ArrowRightOnRectangleIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              {...register('email')}
              className={`w-full pl-10 px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-400' : 'border-blue-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password')}
              className={`w-full pl-10 px-4 py-3 rounded-xl border ${
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
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-fuchsia-600 transition font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
