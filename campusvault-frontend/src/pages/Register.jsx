import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 10) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'strong':
        return 'text-green-400';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    name &&
    email &&
    password &&
    confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <AuthLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8 backdrop-blur-md"
      >
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-400 text-sm mb-8">Join CampusVault and start your placement journey</p>

        {/* Form Error */}
        {errors.form && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">{errors.form}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-200 focus:outline-none ${
                errors.name
                  ? 'border-red-500/50 focus:border-red-400'
                  : 'border-purple-500/30 focus:border-purple-400'
              }`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              onBlur={() => {
                if (email && !emailRegex.test(email)) {
                  setErrors({ ...errors, email: 'Invalid email format' });
                }
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-200 focus:outline-none ${
                errors.email
                  ? 'border-red-500/50 focus:border-red-400'
                  : 'border-purple-500/30 focus:border-purple-400'
              }`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-200 focus:outline-none ${
                errors.password
                  ? 'border-red-500/50 focus:border-red-400'
                  : 'border-purple-500/30 focus:border-purple-400'
              }`}
            />
            {password && (
              <p className={`text-sm mt-2 font-medium ${getStrengthColor()}`}>
                Password Strength: {passwordStrength}
              </p>
            )}
            {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-200 focus:outline-none ${
                errors.confirmPassword
                  ? 'border-red-500/50 focus:border-red-400'
                  : 'border-purple-500/30 focus:border-purple-400'
              }`}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              isFormValid && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transform hover:scale-105 shadow-lg shadow-purple-500/50'
                : 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Login
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
