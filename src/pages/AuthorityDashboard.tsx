import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Upload,
} from 'lucide-react';

interface AssignedIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

export default function AuthorityDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<AssignedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadAssignedIssues();
    }
  }, [user]);

  async function loadAssignedIssues() {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .or(`assigned_to.eq.${user?.id},status.in.(VERIFIED,IN_PROGRESS)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(issueId: string) {
    if (!newStatus || !user) return;

    setUpdating(true);
    try {
      await supabase
        .from('issues')
        .update({
          status: newStatus as any,
          assigned_to: user.id,
        })
        .eq('id', issueId);

      if (comment.trim()) {
        await supabase.from('comments').insert({
          issue_id: issueId,
          user_id: user.id,
          content: comment.trim(),
        });
      }

      setSelectedIssue(null);
      setNewStatus('');
      setComment('');
      loadAssignedIssues();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  }

  const stats = {
    total: issues.length,
    verified: issues.filter((i) => i.status === 'VERIFIED').length,
    inProgress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
    resolved: issues.filter((i) => i.status === 'RESOLVED').length,
  };

  if (!user || profile?.role !== 'AUTHORITY') {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authority Dashboard</h1>
          <p className="text-gray-600">Manage and resolve civic issues</p>
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
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
                <p className="text-gray-600">Total Issues</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.verified}</h3>
                <p className="text-gray-600">Verified</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.inProgress}</h3>
                <p className="text-gray-600">In Progress</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.resolved}</h3>
                <p className="text-gray-600">Resolved</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Issues to Manage</h2>

              {issues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No issues to manage at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{issue.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                issue.status === 'RESOLVED'
                                  ? 'bg-green-100 text-green-700'
                                  : issue.status === 'IN_PROGRESS'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {issue.status.replace('_', ' ')}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              {issue.category}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{issue.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Location: {issue.location}</span>
                            <span>Reporter: {issue.profiles?.name}</span>
                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {selectedIssue === issue.id ? (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Update Status
                              </label>
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select new status</option>
                                {issue.status !== 'IN_PROGRESS' && (
                                  <option value="IN_PROGRESS">In Progress</option>
                                )}
                                {issue.status !== 'RESOLVED' && (
                                  <option value="RESOLVED">Resolved</option>
                                )}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Add Comment (Optional)
                              </label>
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Add a note about this status change..."
                              />
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => handleUpdateStatus(issue.id)}
                                disabled={!newStatus || updating}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updating ? 'Updating...' : 'Update Status'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedIssue(null);
                                  setNewStatus('');
                                  setComment('');
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => setSelectedIssue(issue.id)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => navigate(`/issues/${issue.id}`)}
                            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
