import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, 
  MapPin,  
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    package: '',
    website: '',
    minCGPA: '7.0',
    maxBacklogs: '0',
    branches: ['CSE', 'IT']
  });

  const availableBranches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/company`
    );
      setCompanies(response.data.payload || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch companies.');
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branch) => {
    setFormData(prev => {
      const branches = prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch];
      return { ...prev, branches };
    });
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      package: '',
      website: '',
      minCGPA: '7.0',
      maxBacklogs: '0',
      branches: ['CSE', 'IT']
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditInit = (company) => {
    setEditingId(company._id);
    setIsAdding(true);
    setFormData({
      name: company.name,
      description: company.description || '',
      location: company.location || '',
      package: company.package || '',
      website: company.website || '',
      minCGPA: company.eligibility?.minCGPA || '7.0',
      maxBacklogs: company.eligibility?.maxBacklogs || '0',
      branches: company.eligibility?.branches || ['CSE', 'IT']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.package) {
      setError('Company Name and CTC Package are required.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      package: parseFloat(formData.package),
      website: formData.website,
      eligibility: {
        minCGPA: parseFloat(formData.minCGPA) || 6.0,
        maxBacklogs: parseInt(formData.maxBacklogs) || 0,
        branches: formData.branches
      }
    };

    try {
      if (editingId) {
        // Update
        const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/company/${editingId}`,
       payload
        );
        setSuccess('Recruiter profile updated successfully!');
      } else {
        // Create
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/company`, payload);
        setSuccess('New Recruiter added successfully!');
      }
      
      handleResetForm();
      fetchCompanies();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save company details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company? It may delete associated drives.')) return;
    setError('');
    setSuccess('');

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/company/${id}`);
      setSuccess('Recruiter removed successfully.');
      fetchCompanies();
    } catch (err) {
      console.error(err);
      setError('Failed to delete recruiter.');
    }
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center animate-pulse text-slate-500">
        <Building2 className="w-8 h-8 mr-2 animate-spin" />
        <span>Syncing company datasets...</span>
      </div>
    );
  }

  return (
  <div className="space-y-6">

    {/* Header */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">

      <div>
        <h3 className="text-xl font-semibold text-white">
          Manage Companies
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          Add and manage hiring companies.
        </p>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Company
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
          {editingId ? 'Edit Company' : 'Add Company'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Company Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Company Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))
              }
              placeholder="Google"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              required
            />
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Package (LPA)
            </label>

            <input
              type="number"
              step="0.1"
              value={formData.package}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  package: e.target.value
                }))
              }
              placeholder="12"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
              required
            />
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
              placeholder="Hyderabad"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Website
            </label>

            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  website: e.target.value
                }))
              }
              placeholder="https://company.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
          </div>

          {/* Min CGPA */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Min CGPA
            </label>

            <input
              type="number"
              step="0.01"
              value={formData.minCGPA}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  minCGPA: e.target.value
                }))
              }
              placeholder="7"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
          </div>

          {/* Backlogs */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Max Backlogs
            </label>

            <input
              type="number"
              value={formData.maxBacklogs}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  maxBacklogs: e.target.value
                }))
              }
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
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
            placeholder="Company details..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none min-h-[100px]"
          />
        </div>

        {/* Branches */}
        <div>
          <label className="block text-sm text-slate-400 mb-3">
            Eligible Branches
          </label>

          <div className="flex flex-wrap gap-3">

            {availableBranches.map((branch) => (

              <label
                key={branch}
                className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-300 cursor-pointer"
              >

                <input
                  type="checkbox"
                  checked={formData.branches.includes(branch)}
                  onChange={() => handleBranchChange(branch)}
                  className="w-4 h-4"
                />

                <span>{branch}</span>

              </label>
            ))}

          </div>
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

            {editingId ? 'Save Changes' : 'Add Company'}
          </button>

        </div>

      </form>
    )}

    {/* Companies Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

      {companies.map((company) => (

        <div
          key={company._id}
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between"
        >

          <div>

            {/* Top */}
            <div className="flex justify-between items-start gap-3">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white font-semibold">
                  {company.name.charAt(0)}
                </div>

                <div>

                  <h4 className="text-lg font-semibold text-white">
                    {company.name}
                  </h4>

                  <div className="flex items-center gap-1 mt-1 text-sm text-slate-400">
                    <MapPin className="w-4 h-4" />

                    <span>
                      {company.location || 'Remote'}
                    </span>
                  </div>

                </div>

              </div>

              {/* Actions */}
              <div className="flex gap-2">

                <button
                  onClick={() => handleEditInit(company)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(company._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed mt-4">
              {company.description || 'No description available.'}
            </p>

            {/* Package */}
            <div className="mt-5 p-4 bg-slate-950 border border-slate-800 rounded-lg">

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <DollarSign className="w-4 h-4" />

                <span>Package</span>
              </div>

              <p className="text-xl font-semibold text-white">
                {company.package} LPA
              </p>

            </div>

          </div>

          {/* Bottom */}
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-sm">

            <p className="text-slate-400">
              Branches:{' '}
              <span className="text-slate-200">
                {company.eligibility?.branches.join(', ')}
              </span>
            </p>

            <p className="text-slate-400">
              Min CGPA:{' '}
              <span className="text-slate-200">
                {company.eligibility?.minCGPA}
              </span>
            </p>

            <p className="text-slate-400">
              Max Backlogs:{' '}
              <span className="text-slate-200">
                {company.eligibility?.maxBacklogs}
              </span>
            </p>

          </div>

        </div>
      ))}

    </div>

  </div>
);
};

export default ManageCompanies;
