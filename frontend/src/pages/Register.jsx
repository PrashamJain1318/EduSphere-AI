import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, clearError } from '../store/slices/authSlice.js';
import api from '../utils/api.js';
import { User, Mail, Lock, GraduationCap, School, Layers, Loader2 } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('student');
  const [board, setBoard] = useState('CBSE');
  const [userClass, setUserClass] = useState('10');
  const [stream, setStream] = useState('Science');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErr, setLocalErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    setSuccessMsg('');
    dispatch(setLoading(true));

    try {
      const payload = {
        name,
        email,
        password,
        role,
        board: role === 'student' ? board : null,
        class: role === 'student' ? userClass : null,
        stream: role === 'student' && userClass === '12' ? stream : null,
      };

      const res = await api.post('/auth/register', payload);

      if (res.data.success) {
        setSuccessMsg('Registration successful! Redirecting to login...');
        setTimeout(() => {
          dispatch(setLoading(false));
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
      dispatch(setError(errMsg));
      setLocalErr(errMsg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-[#0b0f19]">
      <div className="w-full max-w-lg glass-card p-8 rounded-3xl border shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 mt-2">Join the EduSphere AI learning community</p>
        </div>

        {/* Alerts */}
        {localErr && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-500 text-xs rounded-xl p-3 mb-6 font-medium">
            {localErr}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/25 text-green-500 text-xs rounded-xl p-3 mb-6 font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Role
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl border transition-all ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'border-slate-300 hover:border-slate-400 text-slate-500'
                }`}
              >
                I am a Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl border transition-all ${
                  role === 'teacher'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'border-slate-300 hover:border-slate-400 text-slate-500'
                }`}
              >
                I am a Teacher
              </button>
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100/30 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              {/* Board Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Board
                </label>
                <div className="relative">
                  <School className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
              </div>

              {/* Class Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Class
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <select
                    value={userClass}
                    onChange={(e) => setUserClass(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="10">Class 10</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>

              {/* Stream Selector (Class 12 Only) */}
              {userClass === '12' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Select Stream (Required for Class 12)
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Science">Science (PCM/PCB/CS)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Humanities">Humanities / Arts</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

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
                className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
