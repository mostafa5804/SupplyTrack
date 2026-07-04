import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { api } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'admin',
      password: 'password',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await api.post('/login', data);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏭</div>
          <h1 className="text-2xl font-bold text-foreground">ورود به سامانه</h1>
          <p className="text-muted-foreground mt-2 text-sm">جهت ورود نام کاربری و رمز عبور خود را وارد کنید.</p>
        </div>
        
        {error && <div className="bg-destructive/15 text-destructive p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">نام کاربری</label>
            <input 
              type="text" 
              {...register('username')}
              className="w-full bg-secondary border border-border rounded-xl p-3 text-sm focus:border-primary outline-none transition-colors"
            />
            {errors.username && <p className="text-destructive text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">رمز عبور</label>
            <input 
              type="password" 
              {...register('password')}
              className="w-full bg-secondary border border-border rounded-xl p-3 text-sm focus:border-primary outline-none transition-colors"
            />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 mt-4 transition-colors"
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
          <p className="font-semibold mb-2">کاربران پیش‌فرض جهت تست (رمز عبور برای همه: password):</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>reza (درخواست‌کننده)</li>
            <li>hasan (سرپرست)</li>
            <li>maryam (انباردار)</li>
            <li>sina (مسئول خرید)</li>
            <li>negar (ادمین)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
