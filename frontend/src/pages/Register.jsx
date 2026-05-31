import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Hash,  AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: 'CSE',
    cgpa: '',
    backlogs: 0,
    phone: '',
    skills: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL','EEE'];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name || !formData.email || !formData.password || !formData.rollNumber) {
      setError('Please fill in all core fields.');
      return;
    }

    const cgpaVal = parseFloat(formData.cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      setError('CGPA must be a valid number between 0.0 and 10.0');
      return;
    }

    const registrationPayload = {
      ...formData,
      cgpa: cgpaVal,
      backlogs: parseInt(formData.backlogs) || 0,
      role: 'student' // Force role to student for user registers
    };

    const res = await register(registrationPayload);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(res.error);
    }
  };

  return (
  <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-5">
    
    <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">S</span>
        </div>

        <span className="text-xl font-semibold text-white">
          Smart Placement Tracker
        </span>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Create Account
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Register to access placements and opportunities.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg border border-green-500/20 bg-green-500/10 text-green-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>Registration successful. Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                required
              />
            </div>
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Roll Number
            </label>

            <div className="relative">
              <Hash className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

              <input
                id="rollNumber"
                type="text"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="23EG110A60"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                required
              />
            </div>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Branch
            </label>

            <select
              id="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-slate-500"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* CGPA */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              CGPA
            </label>

            <input
              id="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="8.5"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              required
            />
          </div>

          {/* Backlogs */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Backlogs
            </label>

            <input
              id="backlogs"
              type="number"
              min="0"
              value={formData.backlogs}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9848012345"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>

        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Skills
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="React, Java, SQL..."
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />

            <button
              type="button"
              onClick={handleAddSkill}
              className="px-5 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              Add
            </button>
          </div>

          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-sm text-slate-300"
                >
                  <span>{skill}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </p>

    </div>
  </div>
);
};

export default Register;
