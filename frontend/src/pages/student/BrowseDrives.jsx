import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  MapPin, 
  DollarSign,    
  AlertTriangle,
  FileText,
  Clock,
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const BrowseDrives = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch open drives
      const drivesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/drive`);
      setDrives(drivesRes.data.payload || []);

      // Fetch student's applications to highlight which ones they already applied for
      const appsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/application/my-applications`);
      const ids = (appsRes.data.payload || []).map(app => app.drive?._id || app.drive);
      setAppliedIds(ids);
    } catch (err) {
      console.error("Error fetching drives", err);
      setError('Could not fetch campus placement drives.');
    } finally {
      setLoading(false);
    }
  };

  // Eligibility checking
  const checkEligibility = (drive) => {
    const minCGPA = drive.company?.eligibility?.minCGPA || 0;
    const maxBacklogs = drive.company?.eligibility?.maxBacklogs ?? 99;
    const branches = drive.company?.eligibility?.branches || [];

    const meetsCGPA = (user?.cgpa || 0) >= minCGPA;
    const meetsBacklogs = (user?.backlogs || 0) <= maxBacklogs;
    const meetsBranch = branches.includes(user?.branch);

    const reasons = [];
    if (!meetsCGPA) reasons.push(`CGPA requires min ${minCGPA} (Yours: ${user?.cgpa || 0})`);
    if (!meetsBacklogs) reasons.push(`Backlogs maximum allowed: ${maxBacklogs} (Yours: ${user?.backlogs || 0})`);
    if (!meetsBranch) reasons.push(`Branch mismatch. Allowed: ${branches.join(', ')} (Yours: ${user?.branch || 'None'})`);

    return {
      eligible: meetsCGPA && meetsBacklogs && meetsBranch,
      reasons
    };
  };

  const handleApply = async (driveId) => {
    setSubmitting(true);
    setError('');
    setActionSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/application`, {
        drive: driveId
      });
      
      setActionSuccess('Applied successfully! Resume forwarded to recruiting partner.');
      setAppliedIds(prev => [...prev, driveId]);
      
      // Close modal if open
      setTimeout(() => {
        setSelectedDrive(null);
        setActionSuccess('');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter drives list
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.title.toLowerCase().includes(search.toLowerCase()) || 
                          drive.company?.name.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterEligibleOnly) {
      return checkEligibility(drive).eligible;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-900/60 rounded-xl border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-80 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
  <div className="space-y-6">

    {/* Search Section */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">

      {/* Search */}
      <div className="relative w-full md:w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="w-5 h-5" />
        </span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drives or companies..."
          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 text-sm"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filterEligibleOnly}
            onChange={(e) => setFilterEligibleOnly(e.target.checked)}
            className="w-4 h-4"
          />

          Eligible Only
        </label>

        <span className="text-sm text-slate-500">
          {filteredDrives.length} drives
        </span>
      </div>
    </div>

    {/* Error */}
    {error && !selectedDrive && (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    )}

    {/* No Drives */}
    {filteredDrives.length === 0 ? (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-lg">
        <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />

        <h3 className="text-lg font-medium text-white">
          No Drives Found
        </h3>

        <p className="text-sm text-slate-500 mt-2">
          Try changing your search or filters.
        </p>
      </div>
    ) : (

      /* Drives Grid */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredDrives.map((drive) => {

          const { eligible } = checkEligibility(drive);

          const isApplied = appliedIds.includes(drive._id);

          return (
            <div
              key={drive._id}
              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
            >

              {/* Card Content */}
              <div className="p-5">

                {/* Top */}
                <div className="flex justify-between items-start mb-4">

                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                    {drive.company?.name}
                  </span>

                  {eligible ? (
                    <span className="text-xs text-green-400">
                      Eligible
                    </span>
                  ) : (
                    <span className="text-xs text-red-400">
                      Ineligible
                    </span>
                  )}

                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {drive.title}
                </h3>

                {/* Info */}
                <div className="space-y-2 text-sm text-slate-400 mb-4">

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{drive.company?.package} LPA</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{drive.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Apply by{" "}
                      {new Date(
                        drive.lastDateToApply
                      ).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {drive.description}
                </p>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 flex items-center justify-between">

                {isApplied ? (
                  <span className="text-sm text-green-400 font-medium">
                    Applied
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">
                    Open Drive
                  </span>
                )}

                <button
                  onClick={() => setSelectedDrive(drive)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors"
                >
                  View Drive
                </button>

              </div>

            </div>
          );
        })}
      </div>
    )}

    {/* Modal */}
    {selectedDrive && (() => {

      const { eligible, reasons } = checkEligibility(selectedDrive);

      const isApplied = appliedIds.includes(selectedDrive._id);

      const isPastDeadline =
        new Date(selectedDrive.lastDateToApply) < new Date();

      const hasResume = !!user?.resume;

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-lg p-6 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">

              <div>
                <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                  {selectedDrive.company?.name}
                </span>

                <h2 className="text-2xl font-semibold text-white mt-3">
                  {selectedDrive.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedDrive(null)}
                className="text-slate-500 hover:text-white text-2xl"
              >
                ×
              </button>

            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">
                  Package
                </p>

                <p className="text-white font-medium">
                  {selectedDrive.company?.package} LPA
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">
                  Location
                </p>

                <p className="text-white font-medium">
                  {selectedDrive.location}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">
                  Drive Date
                </p>

                <p className="text-white font-medium">
                  {new Date(
                    selectedDrive.driveDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">
                  Deadline
                </p>

                <p className="text-white font-medium">
                  {new Date(
                    selectedDrive.lastDateToApply
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            {/* Description */}
            <div className="mb-6">

              <h3 className="text-lg font-medium text-white mb-3">
                Description
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                {selectedDrive.description}
              </p>

            </div>

            {/* Eligibility */}
            <div className="mb-6 bg-slate-950 border border-slate-800 rounded-lg p-4">

              <h3 className="text-lg font-medium text-white mb-3">
                Eligibility
              </h3>

              <div className="space-y-2 text-sm text-slate-400">

                <p>
                  Minimum CGPA:{" "}
                  {selectedDrive.company?.eligibility?.minCGPA}
                </p>

                <p>
                  Max Backlogs:{" "}
                  {selectedDrive.company?.eligibility?.maxBacklogs}
                </p>

                <p>
                  Branches:{" "}
                  {selectedDrive.company?.eligibility?.branches.join(", ")}
                </p>

              </div>

              {!eligible && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                  {reasons.map((r, i) => (
                    <p key={i}>• {r}</p>
                  ))}
                </div>
              )}

            </div>

            {/* Actions */}
<div className="flex gap-3">

  <button
    onClick={() => setSelectedDrive(null)}
    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
  >
    Close
  </button>

  {isApplied ? (
    <button
      disabled
      className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-lg"
    >
      Applied
    </button>
  ) : isPastDeadline ? (
    <button
      disabled
      className="flex-1 py-3 bg-slate-800 text-slate-500 rounded-lg"
    >
      Deadline Passed
    </button>
  ) : !eligible ? (
    <button
      disabled
      className="flex-1 py-3 bg-slate-800 text-slate-500 rounded-lg"
    >
      Not Eligible
    </button>
  ) : !hasResume ? (
    <button
      onClick={() => {
        setSelectedDrive(null);
        navigate("/student/profile");
      }}
      className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white transition-colors"
    >
      Upload Resume to Apply
    </button>
  ) : (
    <button
      onClick={() => handleApply(selectedDrive._id)}
      disabled={submitting}
      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
    >
      {submitting ? "Applying..." : "Apply Now"}
    </button>
  )}

</div>

          </div>
        </div>
      );
    })()}
  </div>
);
};

export default BrowseDrives;
