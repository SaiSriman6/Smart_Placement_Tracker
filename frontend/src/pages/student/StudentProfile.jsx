import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  GraduationCap,
  Hash,
  Phone,
  Percent,
  AlertTriangle,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const StudentProfile = () => {

  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cgpa: user?.cgpa || '',
    backlogs: user?.backlogs || 0,
    resume: user?.resume || '',
    skills: user?.skills || []
  });

  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {

    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));

  };

  const handleAddSkill = (e) => {

    e.preventDefault();

    if (
      skillInput.trim() &&
      !formData.skills.includes(skillInput.trim())
    ) {

      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));

      setSkillInput('');

    }

  };

  const handleRemoveSkill = (skillToRemove) => {

    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (s) => s !== skillToRemove
      )
    }));

  };

  const handleResumeChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      resume: file
    }));

  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');
  setSuccess('');
  setSubmitting(true);

  try {
    const profilePayload = {
      phone: formData.phone,
      skills: formData.skills
    };

    // Update profile details
    // Update profile details
   const response = await axios.put(
   `${import.meta.env.VITE_API_URL}/api/auth/${user._id}`,
   profilePayload,
   {
    withCredentials: true
    }
   );

   setUser(response.data.payload);

    // Upload resume separately
   if (formData.resume instanceof File) {

  const resumeData = new FormData();

  resumeData.append("resume", formData.resume);

  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/auth/upload-resume`,
    resumeData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  setUser(response.data.payload);
}

    setSuccess("Profile updated successfully");

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.message ||
      "Failed to update profile"
    );
  } finally {
    setSubmitting(false);
  }
};

  return (

    <div className="space-y-6">

      {/* Header */}
      <div className="glass p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 text-2xl uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div>

            <h3 className="text-xl font-bold text-white">
              {user?.name}
            </h3>

            <p className="text-xs text-slate-450 mt-1">
              Roll Number: {user?.rollNumber}
              {" • "}
              {user?.branch} Department
            </p>

          </div>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            user?.isPlaced
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
          }`}
        >
          {user?.isPlaced
            ? 'Placed 🎉'
            : 'Actively Seeking Hires'}
        </span>

      </div>

      {/* Error */}
      {error && (

        <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 text-sm">

          <AlertCircle className="w-5 h-5" />

          <span>{error}</span>

        </div>

      )}

      {/* Success */}
      {success && (

        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-sm">

          <CheckCircle2 className="w-5 h-5" />

          <span>{success}</span>

        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >

        {/* Editable */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 lg:col-span-2 space-y-6">

          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 uppercase tracking-wider">
            Professional Profile
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Phone */}
            <div>

              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              >
                Contact Phone
              </label>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <Phone className="w-4 h-4" />
                </span>

                <input
                  id="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />

              </div>

            </div>

            {/* Resume */}
            <div>

              <label
                htmlFor="resume"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              >
                Upload Resume
              </label>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <FileText className="w-4 h-4" />
                </span>

                <input
                  id="resume"
                  type="file"
                  accept=".doc,.docx"
                  onChange={handleResumeChange}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-3
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-xl
                    text-white
                    file:mr-4
                    file:py-2
                    file:px-4
                    file:rounded-lg
                    file:border-0
                    file:bg-brand-500
                    file:text-white
                    file:text-xs
                    file:font-semibold
                  "
                />

              </div>

              {formData.resume && (
  <button
    type="button"
    onClick={() => {
      window.open(
        `${import.meta.env.VITE_API_URL}/api/auth/download-resume`,
        "_blank"
      );
    }}
    className="text-brand-400 text-xs mt-2 inline-block hover:underline"
  >
    Download Current Resume
  </button>
)}

            </div>

          </div>

          {/* Skills */}
          <div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Skills
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                placeholder="React, NodeJS..."
              />

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-slate-800 rounded-xl text-white text-sm"
              >
                Add
              </button>

            </div>

            <div className="flex flex-wrap gap-2 mt-3">

              {formData.skills.map((skill, index) => (

                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center gap-2"
                >

                  {skill}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSkill(skill)
                    }
                  >
                    ×
                  </button>

                </span>

              ))}

            </div>

          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-slate-800">

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs"
            >

              <Save className="w-4 h-4" />

              {submitting
                ? 'Saving...'
                : 'Save Changes'}

            </button>

          </div>

        </div>

        {/* Readonly */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">

          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 uppercase tracking-wider">
            Locked Academic Details
          </h4>

          <div className="space-y-4">

            <div>

              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Email
              </p>

              <div className="flex items-center gap-2 mt-1 text-white">

                <Mail className="w-4 h-4 text-slate-500" />

                {user?.email}

              </div>

            </div>

            <div>

              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Roll Number
              </p>

              <div className="flex items-center gap-2 mt-1 text-white">

                <Hash className="w-4 h-4 text-slate-500" />

                {user?.rollNumber}

              </div>

            </div>

            <div>

              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Branch
              </p>

              <div className="flex items-center gap-2 mt-1 text-white">

                <GraduationCap className="w-4 h-4 text-slate-500" />

                {user?.branch}

              </div>

            </div>

            <div>

              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                CGPA
              </p>

              <div className="flex items-center gap-2 mt-1 text-white">

                <Percent className="w-4 h-4 text-slate-500" />

                {formData.cgpa}

              </div>

            </div>

            <div>

              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Backlogs
              </p>

              <div className="flex items-center gap-2 mt-1 text-white">

                <AlertTriangle className="w-4 h-4 text-slate-500" />

                {formData.backlogs}

              </div>

            </div>

          </div>

        </div>

      </form>

    </div>

  );

};

export default StudentProfile;