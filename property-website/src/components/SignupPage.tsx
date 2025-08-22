import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { colors, shadows, animations, variants } from '../theme';

interface SignupFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
}

interface OTPFormData {
  otp: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    mobileNumber: ''
  });
  const [otpData, setOtpData] = useState<OTPFormData>({
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const otpValue = value.replace(/\D/g, '').slice(0, 4);
    setOtpData({ otp: otpValue });
  };

  const startOTPTimer = () => {
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/temp/signup/send-otp', {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber
      });

      if (response.status === 200) {
        setSuccess('OTP sent successfully!');
        setOtpSent(true);
        startOTPTimer();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/temp/signup/verify-otp', {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        otp: otpData.otp
      });

      if (response.status === 201) {
        setSuccess('Account created successfully!');
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to property upload page
        setTimeout(() => {
          navigate('/upload-property');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/temp/signup/send-otp', {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber
      });

      if (response.status === 200) {
        setSuccess('OTP resent successfully!');
        startOTPTimer();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center py-8 px-4"
      style={{ backgroundColor: colors.GRAY_50 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animations.ease}
    >
      <motion.div 
        className="w-full max-w-md"
        variants={variants.scale}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="card"
          style={{ 
            backgroundColor: colors.WHITE,
            boxShadow: shadows.xl
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: shadows['2xl']
          }}
          transition={animations.ease}
        >
          <div className="card-body">
            <motion.div
              variants={variants.fadeIn}
              initial="initial"
              animate="animate"
              className="text-center mb-8"
            >
              <motion.h2 
                className="text-3xl font-bold mb-2"
                style={{ color: colors.TEXT_COLOR }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, ...animations.spring }}
              >
                {otpSent ? 'Verify OTP' : 'Create Account'}
              </motion.h2>
              <motion.p 
                style={{ color: colors.GRAY_600 }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, ...animations.spring }}
              >
                {otpSent 
                  ? 'Enter the 4-digit OTP sent to your mobile'
                  : 'Sign up to start uploading properties'
                }
              </motion.p>
            </motion.div>

            {!otpSent ? (
              // Signup Form
              <motion.form 
                onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}
                variants={variants.slideUp}
                initial="initial"
                animate="animate"
              >
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name *
                  </label>
                  <motion.input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    whileFocus={{ 
                      borderColor: colors.PRIMARY_COLOR,
                      scale: 1.02
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    whileFocus={{ 
                      borderColor: colors.PRIMARY_COLOR,
                      scale: 1.02
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number *
                  </label>
                  <motion.input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    required
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter mobile number"
                    whileFocus={{ 
                      borderColor: colors.PRIMARY_COLOR,
                      scale: 1.02
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: shadows.lg
                  }}
                  whileTap={{ scale: 0.98 }}
                  variants={variants.scale}
                >
                  {loading ? (
                    <motion.div 
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="spinner mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending OTP...
                    </motion.div>
                  ) : (
                    'Send OTP'
                  )}
                </motion.button>
              </motion.form>
            ) : (
              // OTP Verification Form
              <motion.form 
                onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }}
                variants={variants.slideUp}
                initial="initial"
                animate="animate"
              >
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">
                    Enter OTP *
                  </label>
                  <motion.input
                    type="text"
                    id="otp"
                    name="otp"
                    required
                    value={otpData.otp}
                    onChange={handleOTPChange}
                    className="form-input text-center text-2xl tracking-widest"
                    placeholder="0000"
                    maxLength={4}
                    whileFocus={{ 
                      borderColor: colors.PRIMARY_COLOR,
                      scale: 1.02
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    OTP sent to {formData.mobileNumber}
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || otpData.otp.length !== 4}
                  className="btn btn-primary w-full mb-4"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: shadows.lg
                  }}
                  whileTap={{ scale: 0.98 }}
                  variants={variants.scale}
                >
                  {loading ? (
                    <motion.div 
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="spinner mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Verifying...
                    </motion.div>
                  ) : (
                    'Verify OTP'
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || otpTimer > 0}
                  className="btn btn-outline w-full"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: shadows.lg
                  }}
                  whileTap={{ scale: 0.98 }}
                  variants={variants.scale}
                >
                  {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="btn btn-secondary w-full mt-4"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: shadows.lg
                  }}
                  whileTap={{ scale: 0.98 }}
                  variants={variants.scale}
                >
                  Back to Signup
                </motion.button>
              </motion.form>
            )}

            {error && (
              <motion.div 
                className="alert alert-error mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={animations.spring}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="alert alert-success mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={animations.spring}
              >
                {success}
              </motion.div>
            )}

            {!otpSent && (
              <motion.div 
                className="text-center mt-6"
                variants={variants.fadeIn}
                initial="initial"
                animate="animate"
              >
                <p style={{ color: colors.GRAY_600 }}>
                  Already have an account?{' '}
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline font-medium"
                    style={{ color: colors.PRIMARY_COLOR }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login here
                  </motion.button>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignupPage; 