'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getSafeSupabase, isSupabaseConfigured } from '@/lib/supabaseSafe';

interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong';
  score: number;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const score = passedChecks;

    let level: 'weak' | 'medium' | 'strong';
    if (score <= 2) {
      level = 'weak';
    } else if (score <= 3) {
      level = 'medium';
    } else {
      level = 'strong';
    }

    return { level, score, checks };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.currentPassword.length > 0 &&
      formData.newPassword.length >= 8 &&
      formData.newPassword === formData.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get the safe Supabase client
      const supabase = await getSafeSupabase();

      // If not configured, use mock implementation
      if (!supabase.isConfigured) {
        console.log('Mock password change (Supabase not configured):', {
          currentPassword: '***',
          newPassword: '***',
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success('Password updated successfully! (Demo mode)');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordStrength(null);
        setLoading(false);
        return;
      }

      // Get the current session token
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult?.data?.session;

      if (!session) {
        toast.error('You must be logged in to change your password');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to change password');
      }

      // Success
      toast.success('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordStrength(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (!passwordStrength) return 'bg-border';
    switch (passwordStrength.level) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const getStrengthLabel = () => {
    if (!passwordStrength) return '';
    return passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1);
  };

  return (
    <div className="bg-[#111] border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-white font-medium mb-2">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your current password"
              className={`w-full bg-[#0a0a0a] border ${
                errors.currentPassword ? 'border-red-500' : 'border-border'
              } text-white pl-10 pr-12 py-2 rounded-lg focus:outline-none focus:border-primary`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-white font-medium mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              className={`w-full bg-[#0a0a0a] border ${
                errors.newPassword ? 'border-red-500' : 'border-border'
              } text-white pl-10 pr-12 py-2 rounded-lg focus:outline-none focus:border-primary`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.newPassword}
            </p>
          )}

          {/* Password Strength Indicator */}
          {formData.newPassword.length > 0 && passwordStrength && (
            <div className="mt-3 space-y-2">
              {/* Strength Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  passwordStrength.level === 'weak' ? 'text-red-500' :
                  passwordStrength.level === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {getStrengthLabel()}
                </span>
              </div>

              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-1 text-sm">
                <PasswordRequirement
                  met={passwordStrength.checks.length}
                  label="8+ characters"
                />
                <PasswordRequirement
                  met={passwordStrength.checks.uppercase}
                  label="Uppercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.checks.lowercase}
                  label="Lowercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.checks.number}
                  label="Number"
                />
                <PasswordRequirement
                  met={passwordStrength.checks.special}
                  label="Special character"
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-white font-medium mb-2">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm your new password"
              className={`w-full bg-[#0a0a0a] border ${
                errors.confirmPassword ? 'border-red-500' : 'border-border'
              } text-white pl-10 pr-12 py-2 rounded-lg focus:outline-none focus:border-primary`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
          {formData.confirmPassword &&
            formData.newPassword === formData.confirmPassword &&
            !errors.confirmPassword && (
              <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Passwords match
              </p>
            )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition ${
              isFormValid() && !loading
                ? 'bg-primary hover:bg-primary/80 text-white'
                : 'bg-[#1a1a1a] text-muted-foreground cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper component for password requirements
function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={met ? 'text-green-500' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );
}