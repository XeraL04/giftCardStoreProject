import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { login as loginApi } from '../api/auth';
import { useAuthStore } from '../app/store';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (form: LoginForm) => {
    setError('');
    try {
      const user = await loginApi(form.email, form.password);
      setUser(user);

      // Role-based redirect
      if (user.role === 'admin') {
        navigate('/admin');  // Redirect admins to /admin dashboard
      } else {
        navigate('/dashboard');  // Redirect regular users to /dashboard
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-8 mt-12">
      <h1 className="text-xl font-bold mb-6">Login</h1>
      {error && <div className="mb-2 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <div className="text-xs text-red-500">{errors.email.message}</div>}
        </div>
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && <div className="text-xs text-red-500">{errors.password.message}</div>}
        </div>
        <button
          className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
