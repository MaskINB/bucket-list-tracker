'use client';

import { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { configureAmplify } from '@/src/lib/amplify';

configureAmplify();

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName,
          },
        },
      });
      setStep('confirm');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmSignUp({ username: formData.email, confirmationCode: code });
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Confirmation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center px-4">
      <div className="bg-[#1e2335] border border-[#2d3748] p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-8">
          🪣 Create Account
        </h2>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-800">
            {error}
          </div>
        )}

        {step === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#a0aec0] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#a0aec0] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a0aec0] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a0aec0] mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                placeholder="Min 8 characters"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#6366f1]/30 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <p className="text-sm text-[#a0aec0] text-center">
              We sent a verification code to <strong className="text-[#e0e7ff]">{formData.email}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-[#a0aec0] mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
                placeholder="123456"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#6366f1]/30 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Confirm Account'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#a0aec0] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6366f1] font-medium hover:text-[#8b5cf6] transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}