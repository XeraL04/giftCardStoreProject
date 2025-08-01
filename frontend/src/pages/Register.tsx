import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuthStore } from '../app/store';
import { useState } from 'react';

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string()
    .optional()
    .or(z.literal("")),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export default function Register() {
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
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
    <div className="max-w-md mx-auto bg-white shadow rounded p-8 mt-12">
      <h1 className="text-xl font-bold mb-6">Register</h1>
      {error && <div className="mb-2 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            {...register('name')}
          />
          {errors.name && <div className="text-xs text-red-500">{errors.name.message}</div>}
        </div>
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
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Phone Number (optional)"
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && <div className="text-xs text-red-500">{errors.phoneNumber.message}</div>}
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && <div className="text-xs text-red-500">{errors.password.message}</div>}
        </div>
        <button
          className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
      </p>
    </div>
  );
}
