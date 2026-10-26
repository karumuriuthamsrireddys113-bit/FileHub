import React, { useState } from 'react';
import { X, KeyRound, Mail, AlertCircle, Info } from 'lucide-react';
import { requestPasswordReset } from '../services/authService.js';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await requestPasswordReset({ email });
      setFeedback({
        type: 'info',
        message: result.message || 'Password reset via email is currently in demo mode. SMTP email delivery service is not configured on this server. To reset your password, please contact the administrator or register a new account.'
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.extractedMessage || 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFeedback(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-container modal-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon-badge">
              <KeyRound size={20} />
            </div>
            <div>
              <h3>Reset Password</h3>
              <p>Enter your email to request password recovery</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {feedback && (
            <div className={`auth-alert ${feedback.type === 'error' ? 'auth-alert-danger' : 'auth-alert-info'}`}>
              {feedback.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reset-email" className="form-label">
              Registered Email Address <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-leading-icon" />
              <input
                id="reset-email"
                type="email"
                className="form-input has-leading-icon"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
