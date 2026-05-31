import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileSpreadsheet, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtering State
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/application`);
      setApplications(response.data.payload || []);
    } catch (err) {
      console.error(err);
      setError('Could not fetch candidate applications registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus, currentRound = 0) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/application/${appId}/status`, {
        status: newStatus,
        currentRound: parseInt(currentRound)
      });
      setSuccess(`Application status successfully updated to ${newStatus}!`);
      fetchApplications();
      
      // Auto clear success message
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      console.error(err);
      setError('Failed to update candidate application status.');
    }
  };

  // Filter application list
  const filteredApps = applications.filter(app => {
    const studentName = app.student?.name || '';
    const driveTitle = app.drive?.title || '';
    const companyName = app.drive?.company?.name || '';
    const studentBranch = app.student?.branch || '';

    const matchesSearch = studentName.toLowerCase().includes(search.toLowerCase()) || 
                          driveTitle.toLowerCase().includes(search.toLowerCase()) || 
                          companyName.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (branchFilter !== 'ALL' && studentBranch !== branchFilter) return false;
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center animate-pulse text-slate-500">
        <FileSpreadsheet className="w-8 h-8 mr-2 animate-spin" />
        <span>Syncing candidate application boards...</span>
      </div>
    );
  }

  return (
  <div className="space-y-6">

    {/* Header */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">

      <h3 className="text-xl font-semibold text-white">
        Manage Applications
      </h3>

      <p className="text-sm text-slate-400 mt-1">
        Track and update student applications.
      </p>

    </div>

    {/* Success */}
    {success && (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-green-500/20 bg-green-500/10 text-green-300 text-sm">
        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{success}</span>
      </div>
    )}

    {/* Error */}
    {error && (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    )}

    {/* Filters */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

      {/* Search */}
      <div className="relative w-full md:w-80">

        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="w-4 h-4" />
        </span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search applications..."
          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none"
        />

      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">

        {/* Branch */}
        <div className="flex items-center gap-2">

          <span className="text-sm text-slate-400">
            Branch
          </span>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="ALL">All</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

        </div>

        {/* Status */}
        <div className="flex items-center gap-2">

          <span className="text-sm text-slate-400">
            Status
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="ALL">All</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="round1">Round 1</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>

        </div>

        <span className="text-sm text-slate-500">
          {filteredApps.length} Applications
        </span>

      </div>

    </div>

    {/* Applications Table */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">

      {filteredApps.length === 0 ? (

        <div className="text-center py-20">

          <FileSpreadsheet className="w-12 h-12 text-slate-700 mx-auto mb-3" />

          <h4 className="text-lg font-medium text-white">
            No Applications Found
          </h4>

          <p className="text-sm text-slate-500 mt-1">
            Try changing filters or search.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full text-sm text-left">

            <thead>

              <tr className="border-b border-slate-800 text-slate-400">

                <th className="py-4 px-5">
                  Student
                </th>

                <th className="py-4 px-5">
                  Academic
                </th>

                <th className="py-4 px-5">
                  Drive
                </th>

                <th className="py-4 px-5">
                  Applied
                </th>

                <th className="py-4 px-5 text-center">
                  Status
                </th>

                <th className="py-4 px-5 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredApps.map((app) => {

                const appliedAt =
                  new Date(app.appliedAt).toLocaleDateString();

                return (

                  <tr
                    key={app._id}
                    className="border-b border-slate-800 hover:bg-slate-800/40 text-slate-300"
                  >

                    {/* Student */}
                    <td className="py-4 px-5">

                      <div>

                        <p className="font-medium text-white">
                          {app.student?.name}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {app.student?.rollNumber} • {app.student?.branch}
                        </p>

                      </div>

                    </td>

                    {/* Academic */}
                    <td className="py-4 px-5">

                      <div>

                        <p>
                          {app.student?.cgpa?.toFixed(2)} CGPA
                        </p>

                        <p
                          className={`text-sm mt-1 ${
                            app.student?.backlogs > 0
                              ? 'text-red-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {app.student?.backlogs || 0} Backlogs
                        </p>

                      </div>

                    </td>

                    {/* Drive */}
                    <td className="py-4 px-5">

                      <div>

                        <p className="text-white font-medium">
                          {app.drive?.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {app.drive?.company?.name} • {app.drive?.company?.package} LPA
                        </p>

                      </div>

                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-slate-400">
                      {appliedAt}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">

                      <div className="flex flex-col items-center gap-2">

                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              app._id,
                              e.target.value,
                              app.currentRound
                            )
                          }
                          className={`px-3 py-2 rounded-full text-xs font-medium border focus:outline-none ${
                            app.status === 'selected'
                              ? 'bg-green-500/15 border-green-500/20 text-green-400'
                              : app.status === 'rejected'
                              ? 'bg-red-500/15 border-red-500/20 text-red-400'
                              : app.status === 'shortlisted'
                              ? 'bg-blue-500/15 border-blue-500/20 text-blue-400'
                              : app.status === 'round1'
                              ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                              : 'bg-slate-950 border-slate-700 text-slate-300'
                          }`}
                        >

                          <option value="applied">
                            Applied
                          </option>

                          <option value="shortlisted">
                            Shortlisted
                          </option>

                          <option value="round1">
                            Round 1
                          </option>

                          <option value="selected">
                            Selected
                          </option>

                          <option value="rejected">
                            Rejected
                          </option>

                        </select>

                        <span className="text-xs text-slate-500">
                          Round {app.currentRound}
                        </span>

                      </div>

                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">

                      <div className="flex items-center justify-end gap-2">

                        {/* Resume */}
                        {app.student?.resume && (

                          <a
                            href={app.student.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                        )}

                        {/* Shortlist */}
                        {app.status === 'applied' && (

                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                app._id,
                                'shortlisted',
                                1
                              )
                            }
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
                          >
                            Shortlist
                          </button>

                        )}

                        {/* Approve / Reject */}
                        {(app.status === 'shortlisted' ||
                          app.status === 'round1') && (
                          <>

                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  app._id,
                                  'selected',
                                  app.currentRound + 1
                                )
                              }
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  app._id,
                                  'rejected',
                                  app.currentRound
                                )
                              }
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>

                          </>
                        )}

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>

  </div>
);
};

export default ManageApplications;
