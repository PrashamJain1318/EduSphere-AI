import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setError, clearError, setLoading } from '../store/slices/authSlice.js';
import api from '../utils/api.js';
import { Mail, Lock, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [isAdminTab, setIsAdminTab] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localErr, setLocalErr] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    setLocalErr('');
  }, [isAdminTab, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectUser(user);
    }
  }, [isAuthenticated, user]);

  const redirectUser = (currentUser) => {
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (currentUser.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else {
      // student class routing
      if (currentUser.class === '10') {
        navigate('/dashboard/class10');
      } else {
        navigate('/dashboard/class12');
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    dispatch(setLoading(true));

    try {
      let res;
      if (isAdminTab) {
        res = await api.post('/auth/admin-login', { email, password, secretKey });
      } else {
        res = await api.post('/auth/login', { email, password });
      }

      if (res.data.success) {
        dispatch(loginSuccess({ user: res.data, token: res.data.token }));
        redirectUser(res.data);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      dispatch(setError(errMsg));
      setLocalErr(errMsg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-[#0b0f19]">
      <div className="w-full max-w-md glass-card p-8 rounded-3xl border shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-2">Access your EduSphere AI portal</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setIsAdminTab(false)}
            className={`w-1/2 pb-3 text-sm font-semibold border-b-2 transition-all ${
              !isAdminTab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Student / Teacher
          </button>
          <button
            onClick={() => setIsAdminTab(true)}
            className={`w-1/2 pb-3 text-sm font-semibold border-b-2 transition-all ${
              isAdminTab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Administrator
          </button>
        </div>

        {/* Error Alert */}
        {localErr && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-500 text-xs rounded-xl p-3 mb-6 font-medium">
            {localErr}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Admin Secret Key */}
          {isAdminTab && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Secret Admin Key
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span>Sign In to EduSphere</span>
            )}
          </button>
        </form>

        {!isAdminTab && (
          <div className="text-center mt-6 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
