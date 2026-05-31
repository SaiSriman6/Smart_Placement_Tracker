import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const res = await login(email, password);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      setError(res.error);
    }
  };

  return (
  <div className="min-h-screen bg-slate-950 text-slate-100 relative">

    {/* Left Section */}
    <div className="hidden lg:block absolute left-0 top-0 w-1/2 h-full  border-r border-slate-800">
      <div className="absolute top-1/2 left-16 -translate-y-1/2 max-w-md space-y-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">S</span>
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Smart Placement Tracker
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white leading-tight">
            Placement Management Portal
          </h2>

          <p className="text-slate-400 leading-relaxed">
            Access placement drives, manage applications, and monitor recruitment activities through a centralized platform.
          </p>
        </div>

      </div>
    </div>

    {/* Login Form */}
    <div className="absolute top-1/2 right-0 w-full lg:w-1/2 px-6 -translate-y-1/2">
      
      <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm">

        {/* Mobile Logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
            <span className="text-white font-semibold">S</span>
          </div>

          <h1 className="text-xl font-semibold text-white">
            SmartPT
          </h1>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">
            Sign In
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Enter your credentials to continue.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-slate-300"
            >
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="w-5 h-5" />
              </span>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="w-5 h-5" />
              </span>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-slate-300 hover:text-white transition-colors"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  </div>
);
}

export default Login;