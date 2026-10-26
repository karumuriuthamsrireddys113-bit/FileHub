import React, { useState } from 'react';
import {
  FolderArchive,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { loginUser } from '../services/authService.js';

export default function LoginPage({
  onSwitchToSignUp,
  onAuthSuccess,
  onForgotPassword
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email: trimmedEmail,
        password,
        rememberMe
      });

      if (response.success && response.user) {
        onAuthSuccess(response.user);
      }
    } catch (err) {
      setErrorMessage(
        err.extractedMessage || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to fill demo account credentials for instant evaluation
  const handleQuickDemoFill = () => {
    setEmail('demo@filehub.com');
    setPassword('Password123!');
    setErrorMessage('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-brand-logo">
            <FolderArchive size={28} />
          </div>
          <span className="auth-brand-name">FileHub</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your documents.</p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="auth-alert auth-alert-danger" role="alert">
            <AlertCircle size={18} className="auth-alert-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-leading-icon" />
              <input
                id="login-email"
                type="email"
                className="form-input has-leading-icon"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                autoFocus
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="auth-text-link auth-forgot-link"
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-leading-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input has-leading-icon has-trailing-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="input-trailing-action"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="auth-remember-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-sm" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Helper */}
        <div className="auth-demo-box">
          <div className="auth-demo-info">
            <Sparkles size={16} className="text-primary" />
            <div>
              <p className="auth-demo-title">Test Demo Account</p>
              <p className="auth-demo-creds">demo@filehub.com • Password123!</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={handleQuickDemoFill}
            disabled={isSubmitting}
          >
            Fill Demo
          </button>
        </div>

        {/* Switch to Sign Up */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-text-link auth-switch-link"
              onClick={onSwitchToSignUp}
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
