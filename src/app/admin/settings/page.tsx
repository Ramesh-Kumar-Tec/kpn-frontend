'use client';

import React, { useState } from 'react';
import { Settings, Lock, Shield, Server, CheckCircle, AlertCircle } from 'lucide-react';
import { api, getApiBaseUrl } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await api.put('/auth/update-password', {
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
          Admin Account & Security Settings
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your administrator credentials and review system configurations.
        </p>
      </div>

      {/* Admin Profile Overview */}
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-black text-[#29247c]">
          Logged-in Account Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Full Name</span>
            <p className="font-extrabold text-slate-900 text-sm mt-1">{user?.name || 'Administrator'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Email Address</span>
            <p className="font-extrabold text-slate-900 text-sm mt-1">{user?.email || 'admin@kpnpromoters.in'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Role Privilege</span>
            <p className="font-extrabold text-[#f12131] text-sm mt-1 uppercase">{user?.role || 'superadmin'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Backend API</span>
            <p className="font-extrabold text-emerald-700 text-sm mt-1 truncate" title={getApiBaseUrl()}>{getApiBaseUrl()}</p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-black text-[#29247c]">
          Change Password
        </h2>

        {message && (
          <div
            className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-bold ${
              message.type === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Current Password*
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                New Password*
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Confirm New Password*
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-bold text-white shadow-md hover:bg-[#d81928] disabled:opacity-50"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{isUpdating ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
