import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Briefcase,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch placement drives
        const drivesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/drive`);
        // Fetch student's applications
        const appsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/application/my-applications`);
        
        setDrives(drivesRes.data.payload || []);
        setApplications(appsRes.data.payload || []);
      } catch (err) {
        setError('Could not fetch active recruitment data. Please make sure the backend is running.');
        console.error("Error fetching student dashboard data",error, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Placement Probability Calculator
  const calculateProbability = () => {
    if (user?.isPlaced) return { percent: 100, label: 'Placed!', color: 'text-emerald-400', stroke: '#10b981' };
    
    let score = 40; // Base baseline
    
    // CGPA weight (up to +30 points)
    if (user?.cgpa) {
      if (user.cgpa >= 9.0) score += 30;
      else if (user.cgpa >= 8.0) score += 20;
      else if (user.cgpa >= 7.0) score += 10;
    }

    // Backlog weight (up to -25 points)
    const backlogs = user?.backlogs || 0;
    if (backlogs === 0) score += 15;
    else if (backlogs === 1) score -= 10;
    else if (backlogs >= 2) score -= 25;

    // Skills weight (up to +20 points)
    const skillsCount = user?.skills?.length || 0;
    score += Math.min(skillsCount * 4, 20);

    // Clamp score
    const finalScore = Math.max(Math.min(score, 98), 10);
    
    if (finalScore >= 80) return { percent: finalScore, label: 'Outstanding Chance', color: 'text-emerald-400', stroke: '#10b981' };
    if (finalScore >= 60) return { percent: finalScore, label: 'Very Strong Chance', color: 'text-brand-400', stroke: '#4f68c4' };
    if (finalScore >= 40) return { percent: finalScore, label: 'Good Chance', color: 'text-amber-400', stroke: '#fbbf24' };
    return { percent: finalScore, label: 'Needs Profile Boost', color: 'text-rose-400', stroke: '#f43f5e' };
  };

  const prob = calculateProbability();

  // 2. Eligibility Matcher Logic
  const checkEligibility = (drive) => {
    const reasons = [];
    const minCGPA = drive.company?.eligibility?.minCGPA || 0;
    const maxBacklogs = drive.company?.eligibility?.maxBacklogs ?? 99;
    const branches = drive.company?.eligibility?.branches || [];

    const meetsCGPA = (user?.cgpa || 0) >= minCGPA;
    const meetsBacklogs = (user?.backlogs || 0) <= maxBacklogs;
    const meetsBranch = branches.includes(user?.branch);

    if (!meetsCGPA) reasons.push(`CGPA requires min ${minCGPA} (Yours: ${user?.cgpa || 0})`);
    if (!meetsBacklogs) reasons.push(`Backlogs maximum allowed: ${maxBacklogs} (Yours: ${user?.backlogs || 0})`);
    if (!meetsBranch) reasons.push(`Department branch mismatch. Allowed: ${branches.join(', ')} (Yours: ${user?.branch || 'None'})`);

    return {
      eligible: meetsCGPA && meetsBacklogs && meetsBranch,
      reasons
    };
  };

  // 3. Skill Profile Recommender logic
  const getSkillsInsights = () => {
    // Collect all unique skills required or popular among registered recruiters
    const popularRecruiterSkills = ["React", "Java", "Python", "SQL", "NodeJS", "AWS", "MongoDB", "JavaScript"];
    const studentSkillsLower = (user?.skills || []).map(s => s.toLowerCase());
    
    const missingSkills = popularRecruiterSkills.filter(
      skill => !studentSkillsLower.includes(skill.toLowerCase())
    );

    return {
      owned: user?.skills || [],
      recommended: missingSkills.slice(0, 3)
    };
  };

  const skillsInsights = getSkillsInsights();

  // 4. Stepper Stages mapping for Application Pipeline Tracker
  const getApplicationSteps = (status) => {
    const baseSteps = [
      { key: 'applied', label: 'Applied' },
      { key: 'shortlisted', label: 'Shortlisted' },
      { key: 'round1', label: 'Tech Round 1' },
      { key: 'selected', label: 'Selected' }
    ];

    if (status === 'rejected') {
      return [
        { key: 'applied', label: 'Applied', state: 'done' },
        { key: 'rejected', label: 'Rejected', state: 'error' }
      ];
    }

    const activeIndex = baseSteps.findIndex(s => s.key === status);
    
    return baseSteps.map((step, idx) => {
      let state = 'pending';
      if (status === 'selected') {
        state = 'done';
      } else if (idx <= activeIndex) {
        state = 'done';
      } else if (idx === activeIndex + 1) {
        state = 'active';
      }
      return { ...step, state };
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-96 bg-slate-900/60 rounded-2xl border border-slate-800" />
          <div className="lg:col-span-2 h-96 bg-slate-900/60 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Placed Banner */}

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${user?.isPlaced ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'}`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Placement Status</p>
            <h3 className="text-lg font-bold text-white mt-0.5">{user?.isPlaced ? 'Hired / Placed 🎉' : 'Active Seeker'}</h3>
          </div>
        </div>

        {/* Applied Drives */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Applied Jobs</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{applications.length} Drives</h3>
          </div>
        </div>

        {/* CGPA Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Academic Score</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{user?.cgpa?.toFixed(2) || 'N/A'} CGPA</h3>
          </div>
        </div>

        {/* Active Backlogs Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${user?.backlogs > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Backlogs</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{user?.backlogs || 0}</h3>
          </div>
        </div>
      </div>

      {/* 2. Secondary Insight Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
  {/* KEEP THIS SECTION SAME */}
  {/* Hiring Probability */}
  <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-between min-h-[380px]">
    <div className="w-full flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
        Hiring Probability
      </h3>

      <Sparkles className="w-4 h-4 text-brand-400" />
    </div>

    <div className="relative flex items-center justify-center my-6">
      <svg className="w-44 h-44 transform -rotate-90">
        <circle
          cx="88"
          cy="88"
          r="74"
          stroke="rgba(30, 41, 59, 0.5)"
          strokeWidth="12"
          fill="transparent"
        />

        <circle
          cx="88"
          cy="88"
          r="74"
          stroke={prob.stroke}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={464}
          strokeDashoffset={464 - (464 * prob.percent) / 100}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center text-center">
        <span className="text-4xl font-extrabold text-white tracking-tight">
          {prob.percent}%
        </span>

        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
          Success Index
        </span>
      </div>
    </div>

    <div className="text-center w-full">
      <span className={`text-sm font-semibold ${prob.color}`}>
        {prob.label}
      </span>

      <p className="text-xs text-slate-400 mt-2 px-4 leading-relaxed">
        Based on CGPA ({user?.cgpa}), {user?.backlogs || 0} active backlogs,
        and {user?.skills?.length || 0} skills tags.
      </p>
    </div>
  </div>

  {/* NEW SIMPLE SKILLS SECTION */}
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 lg:col-span-2">

    <div className="flex items-center gap-2 mb-4">
      <Lightbulb className="w-5 h-5 text-slate-300" />

      <h3 className="text-lg font-semibold text-white">
        Skills & Suggestions
      </h3>
    </div>

    <p className="text-sm text-slate-400 mb-6">
      Add more relevant skills to improve placement opportunities.
    </p>

    {/* Current Skills */}
    <div className="mb-6">
      <h4 className="text-sm text-slate-300 mb-3">
        Your Skills
      </h4>

      {skillsInsights.owned.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skillsInsights.owned.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No skills added yet.
        </p>
      )}
    </div>

    {/* Recommended */}
    <div>
      <h4 className="text-sm text-slate-300 mb-3">
        Recommended Skills
      </h4>

      <div className="flex flex-wrap gap-2">
        {skillsInsights.recommended.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-md bg-slate-800 text-slate-200 text-sm"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>

{/* 3. Eligibility Matcher */}
<div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

  <div className="flex items-center gap-2 mb-5">
    <Compass className="w-5 h-5 text-slate-300" />

    <h3 className="text-lg font-semibold text-white">
      Placement Matches
    </h3>
  </div>

  {drives.length === 0 ? (
    <div className="text-center py-10 bg-slate-950 border border-slate-800 rounded-lg">
      <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />

      <p className="text-sm text-slate-400">
        No drives available right now.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {drives.slice(0, 4).map((drive) => {

        const { eligible, reasons } = checkEligibility(drive);

        return (
          <div
            key={drive._id}
            className="bg-slate-950 border border-slate-800 rounded-lg p-4"
          >

            <div className="flex justify-between items-start mb-3">

              <div>
                <h4 className="text-base font-semibold text-white">
                  {drive.title}
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  {drive.company?.name} • {drive.company?.package} LPA
                </p>
              </div>

              {eligible ? (
                <span className="text-green-400 text-sm">
                  Eligible
                </span>
              ) : (
                <span className="text-red-400 text-sm">
                  Ineligible
                </span>
              )}
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {drive.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">

              {!eligible ? (
                <span className="text-sm text-red-400">
                  {reasons[0]}
                </span>
              ) : (
                <span className="text-sm text-slate-500">
                  Matches your profile
                </span>
              )}

              <a
                href="/student/drives"
                className="text-sm text-slate-300 hover:text-white"
              >
                View
              </a>
            </div>

          </div>
        );
      })}
    </div>
  )}
</div>

{/* 4. Pipeline Tracker */}
<div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

  <div className="flex items-center gap-2 mb-6">
    <FileText className="w-5 h-5 text-slate-300" />

    <h3 className="text-lg font-semibold text-white">
      Application Progress
    </h3>
  </div>

  {applications.length === 0 ? (
    <div className="text-center py-10 bg-slate-950 border border-slate-800 rounded-lg">
      <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />

      <p className="text-sm text-slate-400">
        You have not applied to any drives yet.
      </p>

      <a
        href="/student/drives"
        className="inline-block mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
      >
        Browse Drives
      </a>
    </div>
  ) : (
    <div className="space-y-5">

      {applications.map((app) => {

        const steps = getApplicationSteps(app.status);

        return (
          <div
            key={app._id}
            className="bg-slate-950 border border-slate-800 rounded-lg p-5"
          >

            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">

              <div>
                <h4 className="text-base font-semibold text-white">
                  {app.drive?.title}
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  {app.drive?.company?.name}
                </p>
              </div>

              <span className="text-sm text-slate-300 capitalize">
                {app.status}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 relative">

              <div className="absolute top-[14px] left-[12%] right-[12%] h-0.5 bg-slate-800 -z-10" />

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-medium ${
                      step.state === 'done'
                        ? 'bg-slate-700 border-slate-700 text-white'
                        : step.state === 'active'
                        ? 'bg-slate-900 border-slate-500 text-slate-300'
                        : step.state === 'error'
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {step.state === 'done' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span
                    className={`text-xs mt-2 ${
                      step.state === 'done'
                        ? 'text-white'
                        : step.state === 'active'
                        ? 'text-slate-300'
                        : step.state === 'error'
                        ? 'text-red-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  )}
</div>

    </div>
  );
};

export default StudentDashboard;
