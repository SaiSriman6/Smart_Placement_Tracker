import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Percent, 
  TrendingUp, 
  Sparkles, 
  Award, 
  AlertCircle 
} from 'lucide-react';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#4f68c4', '#10b981', '#fbbf24', '#f43f5e', '#a855f7', '#06b6d4'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [studentsRes, companiesRes, drivesRes, appsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/company`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/drive`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/application`)
        ]);

        setStudents(studentsRes.data.payload || []);
        setCompanies(companiesRes.data.payload || []);
        setDrives(drivesRes.data.payload || []);
        setApplications(appsRes.data.payload || []);
      } catch (err) {
        console.error("Error fetching admin statistics", err);
        setError('Failed to fetch analytics datasets. Please ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Process Placement Statistics by Branch
  const getBranchPlacementData = () => {
    const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL','EEE'];
    return branches.map(branch => {
      const branchStudents = students.filter(s => s.role !== 'admin' && s.branch === branch);
      const placed = branchStudents.filter(s => s.isPlaced).length;
      const unplaced = branchStudents.length - placed;

      return {
        name: branch,
        Placed: placed,
        Unplaced: unplaced,
        total: branchStudents.length
      };
    });
  };

  const branchPlacementData = getBranchPlacementData();

  // 2. Process Average CGPA by Branch
  const getBranchCGPAData = () => {
    const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL','EEE'];
    return branches.map(branch => {
      const branchStudents = students.filter(s => s.role !== 'admin' && s.branch === branch);
      const avg = branchStudents.length > 0
        ? Number((branchStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0) / branchStudents.length).toFixed(2))
        : 0;
      return {
        name: branch,
        "Average CGPA": avg
      };
    });
  };

  const branchCGPAData = getBranchCGPAData();

  // 3. Process Package Distribution by Branch
  const getBranchPackageData = () => {
    const branches = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL','EEE'];
    return branches.map(branch => {
      // Find companies/drives hiring this branch
      const hiringCompanies = companies.filter(c => c.eligibility?.branches?.includes(branch));
      const avgPackage = hiringCompanies.length > 0
        ? Number((hiringCompanies.reduce((acc, c) => acc + (c.package || 0), 0) / hiringCompanies.length).toFixed(1))
        : 0;

      return {
        name: branch,
        "Avg Package (LPA)": avgPackage || 3.0 // default fallback
      };
    });
  };

  const branchPackageData = getBranchPackageData();

  // 4. Process Application Pipeline stage counts
  const getApplicationStatusData = () => {
    const stages = {
      applied: 0,
      shortlisted: 0,
      round1: 0,
      selected: 0,
      rejected: 0
    };

    applications.forEach(app => {
      if (stages[app.status] !== undefined) {
        stages[app.status]++;
      }
    });

    return [
      { name: 'Applied Only', value: stages.applied },
      { name: 'Shortlisted', value: stages.shortlisted },
      { name: 'Tech Round', value: stages.round1 },
      { name: 'Hired / Placed', value: stages.selected },
      { name: 'Rejected', value: stages.rejected }
    ].filter(stage => stage.value > 0); // Hide empty slices
  };

  const applicationStatusData = getApplicationStatusData();

  // 5. Global KPI Computations
  const totalStudents = students.filter(s => s.role !== 'admin').length;
  const placedStudents = students.filter(s => s.role !== 'admin' && s.isPlaced).length;
  const placementRate = totalStudents > 0 
    ? Number(((placedStudents / totalStudents) * 100).toFixed(1))
    : 0;
  const activeDrives = drives.filter(d => d.status !== 'completed').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-900/60 rounded-2xl border border-slate-800" />
          <div className="h-96 bg-slate-900/60 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

 return (
  <div className="space-y-6">

    {/* Overview Cards */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {/* Students */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-800 text-slate-300">
          <Users className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Total Students
          </p>

          <h3 className="text-2xl font-semibold text-white mt-1">
            {totalStudents}
          </h3>
        </div>
      </div>

      {/* Placement Ratio */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-800 text-slate-300">
          <Percent className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Placement Ratio
          </p>

          <h3 className="text-2xl font-semibold text-white mt-1">
            {placementRate}%
          </h3>
        </div>
      </div>

      {/* Recruiters */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-800 text-slate-300">
          <Building2 className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Hiring Partners
          </p>

          <h3 className="text-2xl font-semibold text-white mt-1">
            {companies.length}
          </h3>
        </div>
      </div>

      {/* Drives */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-800 text-slate-300">
          <Briefcase className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Active Drives
          </p>

          <h3 className="text-2xl font-semibold text-white mt-1">
            {activeDrives}
          </h3>
        </div>
      </div>

    </div>

    {/* Error */}
    {error && (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    )}

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Placement Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">
            Placement Rates
          </h3>

          <TrendingUp className="w-5 h-5 text-slate-400" />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchPlacementData}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" />

              <XAxis dataKey="name" stroke="#64748b" />

              <YAxis stroke="#64748b" />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />

              <Legend />

              <Bar
                dataKey="Placed"
                stackId="a"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="Unplaced"
                stackId="a"
                fill="#4f68c4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CGPA Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">
            Average CGPA
          </h3>

          <Sparkles className="w-5 h-5 text-slate-400" />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchCGPAData}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" />

              <XAxis dataKey="name" stroke="#64748b" />

              <YAxis domain={[0, 10]} stroke="#64748b" />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />

              <Bar
                dataKey="Average CGPA"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
            {console.log("API URL:", import.meta.env.VITE_API_URL)}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Package Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">
            Average Package
          </h3>

          <Award className="w-5 h-5 text-slate-400" />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={branchPackageData}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" />

              <XAxis dataKey="name" stroke="#64748b" />

              <YAxis stroke="#64748b" />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />

              <Area
                type="monotone"
                dataKey="Avg Package (LPA)"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">
            Hiring Pipeline
          </h3>

          <Users className="w-5 h-5 text-slate-400" />
        </div>

        <div className="h-72 flex items-center justify-center">

          {applicationStatusData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-8">

              <div className="w-60 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      innerRadius={55}
                      outerRadius={75}
                      dataKey="value"
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 text-sm text-slate-400">
                {applicationStatusData.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2">

                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[idx % COLORS.length]
                      }}
                    />

                    <span>
                      {stage.name}: {stage.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No applications yet.
            </p>
          )}

        </div>
      </div>

    </div>

    {/* Table */}
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">

      <h3 className="text-lg font-semibold text-white mb-5">
        Branch Performance Summary
      </h3>

      <div className="overflow-x-auto">

        <table className="w-full text-sm text-left">

          <thead>
            <tr className="border-b border-slate-800 text-slate-400">

              <th className="py-3 px-4">Branch</th>

              <th className="py-3 px-4">Students</th>

              <th className="py-3 px-4">Placed</th>

              <th className="py-3 px-4">Unplaced</th>

              <th className="py-3 px-4">Ratio</th>

            </tr>
          </thead>

          <tbody>

            {branchPlacementData.map((row, idx) => {

              const ratio =
                row.total > 0
                  ? ((row.Placed / row.total) * 100).toFixed(1)
                  : '0';

              return (
                <tr
                  key={idx}
                  className="border-b border-slate-800 hover:bg-slate-800/40 text-slate-300"
                >

                  <td className="py-3 px-4 text-white font-medium">
                    {row.name}
                  </td>

                  <td className="py-3 px-4">
                    {row.total}
                  </td>

                  <td className="py-3 px-4 text-green-400">
                    {row.Placed}
                  </td>

                  <td className="py-3 px-4">
                    {row.Unplaced}
                  </td>

                  <td className="py-3 px-4">

                    <div className="flex items-center gap-3">

                      <span>{ratio}%</span>

                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-slate-500 rounded-full"
                          style={{
                            width: `${ratio}%`
                          }}
                        />

                      </div>
                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>

      </div>
    </div>

  </div>
);
};

export default AdminDashboard;
