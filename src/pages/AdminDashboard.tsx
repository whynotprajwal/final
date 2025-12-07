import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Users,
  FileText,
  CheckCircle,
  BarChart3,
  Edit,
  Trash2,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalIssues: number;
  resolvedIssues: number;
  openIssues: number;
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    openIssues: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  async function loadDashboard() {
    try {
      const [usersData, issuesData] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('issues').select('*'),
      ]);

      if (usersData.data) {
        setUsers(usersData.data);
      }

      if (issuesData.data) {
        setStats({
          totalUsers: usersData.data?.length || 0,
          totalIssues: issuesData.data.length,
          resolvedIssues: issuesData.data.filter((i) => i.status === 'RESOLVED').length,
          openIssues: issuesData.data.filter((i) => i.status === 'OPEN').length,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateRole(userId: string) {
    if (!newRole) return;

    try {
      await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', userId);

      setEditingUser(null);
      setNewRole('');
      loadDashboard();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  if (!user || profile?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Access denied</p>
          <button
            onClick={() => navigate('/issues')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Issues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate('/issues')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Issues</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, issues, and system analytics</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalIssues}</h3>
                <p className="text-gray-600">Total Issues</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.openIssues}</h3>
                <p className="text-gray-600">Open Issues</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.resolvedIssues}</h3>
                <p className="text-gray-600">Resolved Issues</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                        Joined
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((userData) => (
                      <tr key={userData.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{userData.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{userData.email}</td>
                        <td className="px-6 py-4">
                          {editingUser === userData.id ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select role</option>
                              <option value="CITIZEN">CITIZEN</option>
                              <option value="AUTHORITY">AUTHORITY</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                userData.role === 'ADMIN'
                                  ? 'bg-red-100 text-red-700'
                                  : userData.role === 'AUTHORITY'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {userData.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(userData.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === userData.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateRole(userData.id)}
                                disabled={!newRole}
                                className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(null);
                                  setNewRole('');
                                }}
                                className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUser(userData.id);
                                setNewRole(userData.role);
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit Role</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Citizens</span>
                    <span className="font-semibold text-gray-900">
                      {users.filter((u) => u.role === 'CITIZEN').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Authorities</span>
                    <span className="font-semibold text-gray-900">
                      {users.filter((u) => u.role === 'AUTHORITY').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Admins</span>
                    <span className="font-semibold text-gray-900">
                      {users.filter((u) => u.role === 'ADMIN').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Issue Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Open</span>
                    <span className="font-semibold text-yellow-600">{stats.openIssues}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resolved</span>
                    <span className="font-semibold text-green-600">{stats.resolvedIssues}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resolution Rate</span>
                    <span className="font-semibold text-blue-600">
                      {stats.totalIssues > 0
                        ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/issues')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View All Issues
                  </button>
                  <button
                    onClick={() => navigate('/report')}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Report New Issue
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
