import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Mail, 
  Phone, 
  ShieldAlert, 
  UserCheck, 
  ExternalLink 
} from 'lucide-react';
import {useNavigate} from "react-router-dom"
import {
  Pencil
} from "lucide-react";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [placedFilter, setPlacedFilter] = useState('ALL');
  const navigate=useNavigate();
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      console.log("")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`);
      setStudents(response.data.payload || []);
    } catch (err) {
      console.error(err);
      setError('Could not fetch student records database.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlaced = async (studentId, currentPlaced) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/${studentId}`, {
        isPlaced: !currentPlaced
      });
      setSuccess(`Student placement status successfully updated!`);
      fetchStudents();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to update student placement status.');
    }
  };

  const handleToggleActive = async (studentId, currentActive) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/${studentId}`, {
        isActive: !currentActive
      });
      setSuccess(`Student account access status updated!`);
      fetchStudents();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to toggle student account state.');
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    // Only display students, skip admin
    if (student.role === 'admin') return false;

    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          (student.rollNumber || '').toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (branchFilter !== 'ALL' && student.branch !== branchFilter) return false;
    
    if (placedFilter === 'PLACED' && !student.isPlaced) return false;
    if (placedFilter === 'UNPLACED' && student.isPlaced) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center animate-pulse text-slate-500">
        <Users className="w-8 h-8 mr-2 animate-spin" />
        <span>Syncing candidate registration logs...</span>
      </div>
    );
  }

  return (
  <div className="space-y-6">

    {/* Header */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">

      <h3 className="text-xl font-semibold text-white">
        Manage Students
      </h3>

      <p className="text-sm text-slate-400 mt-1">
        View and manage student profiles.
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
          placeholder="Search students..."
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
            <option value="EEE">EEE</option>
          </select>

        </div>

        {/* Placement */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            Placement
          </span>
          <select
            value={placedFilter}
            onChange={(e) => setPlacedFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="ALL">All</option>
            <option value="PLACED">Placed</option>
            <option value="UNPLACED">Unplaced</option>
          </select>
        </div>
        <span className="text-sm text-slate-500">
          {filteredStudents.length} Students
        </span>
      </div>
    </div>
    {/* Table */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-white">
            No Students Found
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            Try changing search or filters.
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
                  Contact
                </th>
                <th className="py-4 px-5">
                  Academic
                </th>
                <th className="py-4 px-5">
                  Skills
                </th>
                <th className="py-4 px-5 text-center">
                  Placement
                </th>
                <th className="py-4 px-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-slate-800 hover:bg-slate-800/40 text-slate-300"
                >
                  {/* Student */}
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-medium text-white">
                        {student.name}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {student.rollNumber || '23EG110AXX'} • {student.branch}
                      </p>

                    </div>

                  </td>

                  {/* Contact */}
                  <td className="py-4 px-5">

                    <div className="space-y-2 text-sm">

                      <div className="flex items-center gap-2">

                        <Mail className="w-4 h-4 text-slate-500" />

                        <span className="text-slate-300">
                          {student.email}
                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <Phone className="w-4 h-4 text-slate-500" />

                        <span className="text-slate-400">
                          {student.phone || '9876543210'}
                        </span>

                      </div>

                    </div>

                  </td>

                  {/* Academic */}
                  <td className="py-4 px-5">

                    <div>

                      <p className="text-white font-medium">
                        {student.cgpa?.toFixed(2) || '7.50'} CGPA
                      </p>

                      <p
                        className={`text-sm mt-1 ${
                          student.backlogs > 0
                            ? 'text-red-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {student.backlogs || 0} Backlogs
                      </p>

                    </div>

                  </td>

                  {/* Skills */}
                  <td className="py-4 px-5">

                    <div className="flex flex-wrap gap-2 max-w-[220px]">

                      {(student.skills || []).slice(0, 3).map((skill, idx) => (

                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-300"
                        >
                          {skill}
                        </span>

                      ))}

                      {(student.skills || []).length > 3 && (

                        <span className="px-2 py-1 bg-slate-950 rounded-md text-xs text-slate-500">
                          +{(student.skills || []).length - 3}
                        </span>

                      )}

                      {(student.skills || []).length === 0 && (

                        <span className="text-sm text-slate-500">
                          No skills
                        </span>

                      )}

                    </div>

                  </td>

                  {/* Placement */}
                  <td className="py-4 px-5 text-center">

                    <button
                      onClick={() =>
                        handleTogglePlaced(
                          student._id,
                          student.isPlaced
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        student.isPlaced
                          ? 'bg-green-500/15 border-green-500/20 text-green-400'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {student.isPlaced ? 'Placed' : 'Unplaced'}
                    </button>
                    {console.log(student)}

                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5">

                    <div className="flex justify-end items-center gap-2">

                      <button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/admin/update-student/${student._id}`);
  }}
  className="p-2 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"
  title="Edit Student"
>
  <Pencil className="w-4 h-4" />
</button>

                      {/* Resume */}
                      {student.resume && (

                        <a
                          href={student.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                      )}

                      {/* Block / Unblock */}
                      <button
                        onClick={() =>
                          handleToggleActive(
                            student._id,
                            student.isActive
                          )
                        }
                        className={`p-2 rounded-lg border transition-colors ${
                          student.isActive
                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                            : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {student.isActive ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <ShieldAlert className="w-4 h-4" />
                        )}
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>

  </div>
);
};

export default ManageStudents;
