import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    description: '',
    driveDate: '',
    lastDateToApply: '',
    location: '',
    mode: 'offline'
  });

  // Round State
  const [addingRoundDriveId, setAddingRoundDriveId] = useState(null);
  const [roundData, setRoundData] = useState({
    roundName: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    fetchDrivesAndCompanies();
  }, []);

  const fetchDrivesAndCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const [drivesRes, companiesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/drive`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/company`)
      ]);
      setDrives(drivesRes.data.payload || []);
      setCompanies(companiesRes.data.payload || []);
      
      if (companiesRes.data.payload?.length > 0) {
        setFormData(prev => ({ ...prev, company: companiesRes.data.payload[0]._id }));
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch active drives or recruiter companies.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      company: companies[0]?._id || '',
      title: '',
      description: '',
      driveDate: '',
      lastDateToApply: '',
      location: '',
      mode: 'offline'
    });
    setIsAdding(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.company || !formData.title || !formData.driveDate || !formData.lastDateToApply) {
      setError('Recruiter company, title, and key date fields are required.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/drive`, formData);
      setSuccess('Placement Drive scheduled successfully!');
      handleResetForm();
      fetchDrivesAndCompanies();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to schedule drive.');
    }
  };

  const handleUpdateStatus = async (driveId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/drive/${driveId}`, {
        status: newStatus
      });
      setSuccess(`Drive status updated to ${newStatus}!`);
      fetchDrivesAndCompanies();
    } catch (err) {
      console.error(err);
      setError('Failed to update drive status.');
    }
  };

  const handleAddRound = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  if (!roundData.roundName || !roundData.date) {
    setError('Round title and scheduled date are required.');
    return;
  }
  try {
    const selectedDrive = drives.find(
      (d) => d._id === addingRoundDriveId
    );
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/drive/${addingRoundDriveId}/round`,
      {
        roundNo:
          (selectedDrive?.rounds?.length || 0) + 1,
        title: roundData.roundName,
        date: roundData.date
      }
    );
    setSuccess(
      'Assessment round successfully added to drive!'
    );
    setAddingRoundDriveId(null);
    setRoundData({
      roundName: '',
      description: '',
      date: ''
    });
    fetchDrivesAndCompanies();
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
      'Failed to append round.'
    );
  }
};

  const handleDeleteDrive = async (driveId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this drive?"
  );

  if (!confirmDelete) return;

  setError('');
  setSuccess('');

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/drive/${driveId}`);

    setSuccess('Drive deleted successfully!');

    // remove deleted drive instantly from UI
    setDrives((prev) => prev.filter((drive) => drive._id !== driveId));

    // OR you can use:
    // fetchDrivesAndCompanies();

  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message || 'Failed to delete drive.'
    );
  }
};

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center animate-pulse text-slate-500">
        <Briefcase className="w-8 h-8 mr-2 animate-spin" />
        <span>Loading drive coordination pipelines...</span>
      </div>
    );
  }

  return (
  <div className="space-y-6">

    {/* Header */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">

      <div>
        <h3 className="text-xl font-semibold text-white">
          Manage Drives
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          Create and manage placement drives.
        </p>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Drive
        </button>
      )}

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

    {/* Form */}
    {isAdding && (
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5"
      >

        <h4 className="text-lg font-medium text-white">
          Add New Drive
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Company */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Company
            </label>

            <select
              value={formData.company}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  company: e.target.value
                }))
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              required
            >
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Drive Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))
              }
              placeholder="Software Engineer"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              required
            />
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Mode
            </label>

            <select
              value={formData.mode}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  mode: e.target.value
                }))
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="offline">
                Offline
              </option>

              <option value="online">
                Online
              </option>
            </select>
          </div>

          {/* Location */}
          <div> 
            <label className="block text-sm text-slate-400 mb-2">
              Location
            </label>

            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  location: e.target.value
                }))
              }
              placeholder="Campus"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
          </div>

          {/* Drive Date */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Drive Date
            </label>

            <input
              type="date"
              value={formData.driveDate}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  driveDate: e.target.value
                }))
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Apply Deadline
            </label>

            <input
              type="date"
              value={formData.lastDateToApply}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  lastDateToApply: e.target.value
                }))
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              required
            />
          </div>

        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Description
          </label>

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))
            }
            placeholder="Drive details..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none min-h-[100px]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={handleResetForm}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Drive
          </button>

        </div>

      </form>
    )}

    {/* Drives */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {drives.map((drive) => (

        <div
          key={drive._id}
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5"
        >

          {/* Top */}
          <div>

            <div className="flex justify-between items-start gap-4">

              <div>
                <h4 className="text-lg font-semibold text-white">
                  {drive.title}
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  {drive.company?.name} • {drive.company?.package} LPA
                </p>
              </div>

              <span
                 className={`px-3 py-1 rounded-full text-xs font-medium ${
                  drive.status === 'completed'
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : drive.status === 'ongoing'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                }`}
              >              
  {drive.status}
</span>

            </div>

            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              {drive.description}
            </p>

            {/* Dates */}
            <div className="space-y-2 mt-4 text-sm text-slate-400">

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />

                <span>
                  Drive Date:{" "}
                  {new Date(
                    drive.driveDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />

                <span>
                  Deadline:{" "}
                  {new Date(
                    drive.lastDateToApply
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>

          </div>

          {/* Rounds */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">

            <div className="flex items-center justify-between mb-4">

              <h5 className="text-sm font-medium text-white">
                Interview Rounds
              </h5>

              {addingRoundDriveId !== drive._id && (
                <button
                  onClick={() =>
                    setAddingRoundDriveId(drive._id)
                  }
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Add Round
                </button>
              )}

            </div>

            {/* Add Round Form */}
            {addingRoundDriveId === drive._id && (

              <form
                onSubmit={handleAddRound}
                className="space-y-3 mb-4"
              >

                <input
                  type="text"
                  value={roundData.roundName}
                  onChange={(e) =>
                    setRoundData(prev => ({
                      ...prev,
                      roundName: e.target.value
                    }))
                  }
                  placeholder="Round Name"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                  required
                />

                <input
                  type="date"
                  value={roundData.date}
                  onChange={(e) =>
                    setRoundData(prev => ({
                      ...prev,
                      date: e.target.value
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                  required
                />

                <textarea
                  value={roundData.description}
                  onChange={(e) =>
                    setRoundData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder="Description"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                />

                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setAddingRoundDriveId(null)
                    }
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm"
                  >
                    Save
                  </button>

                </div>

              </form>
            )}

            {/* Rounds List */}
            {drive.rounds && drive.rounds.length > 0 ? (

              <div className="space-y-2">

                {drive.rounds.map((round) => (
                  <div
                    key={round._id}
                    className="flex justify-between items-center text-sm text-slate-300"
                  >

                    <span>
                      Round {round.roundNo}: {round.title}
                    </span>

                    <span className="text-slate-500">
                      {new Date(
                        round.date
                      ).toLocaleDateString()}
                    </span>

                  </div>
                ))}

              </div>

            ) : (
              <p className="text-sm text-slate-500">
                No rounds added yet.
              </p>
            )}

          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">

            <button
              onClick={() =>
                handleUpdateStatus(drive._id, 'upcoming')
              }
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Upcoming
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(drive._id, 'ongoing')
              }
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Ongoing
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(drive._id, 'completed')
              }
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Completed
            </button>

            <button
              onClick={() =>
                handleDeleteDrive(drive._id)
              }
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm transition-colors"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>

  </div>
);
};

export default ManageDrives;
