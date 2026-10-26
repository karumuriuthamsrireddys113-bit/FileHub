import React, { useState } from 'react';
import {
  FolderArchive,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { signupUser } from '../services/authService.js';

export default function SignUpPage({ onSwitchToLogin, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      newErrors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signupUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.success && response.user) {
        onAuthSuccess(response.user);
      }
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
      setGeneralError(
        err.extractedMessage || 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start organizing your documents privately and securely.</p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="auth-alert auth-alert-danger" role="alert">
            <AlertCircle size={18} className="auth-alert-icon" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <User size={18} className="input-leading-icon" />
              <input
                id="signup-name"
                name="name"
                type="text"
                className={`form-input has-leading-icon ${errors.name ? 'input-error' : ''}`}
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            {errors.name && <p className="form-field-error">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-leading-icon" />
              <input
                id="signup-email"
                name="email"
                type="email"
                className={`form-input has-leading-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <p className="form-field-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">
              Password <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-leading-icon" />
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input has-leading-icon has-trailing-icon ${errors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {errors.password ? (
              <p className="form-field-error">{errors.password}</p>
            ) : (
              <p className="form-helper-text">Must be at least 6 characters long</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="signup-confirm-password" className="form-label">
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-leading-icon" />
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input has-leading-icon has-trailing-icon ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="input-trailing-action"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="form-field-error">{errors.confirmPassword}</p>
            )}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="auth-text-link auth-switch-link"
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
