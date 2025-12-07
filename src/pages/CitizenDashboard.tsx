import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  CheckCircle,
  Trophy,
  Eye,
} from 'lucide-react';

interface UserStats {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  totalUpvotes: number;
}

interface UserIssue {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  upvote_count: number;
}

export default function CitizenDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    totalIssues: 0,
    openIssues: 0,
    resolvedIssues: 0,
    totalUpvotes: 0,
  });
  const [userIssues, setUserIssues] = useState<UserIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  async function loadDashboard() {
    try {
      const { data: issues } = await supabase
        .from('issues')
        .select('*')
        .eq('user_id', user?.id || '');

      const issuesWithUpvotes = await Promise.all(
        (issues || []).map(async (issue) => {
          const { count } = await supabase
            .from('upvotes')
            .select('*', { count: 'exact', head: true })
            .eq('issue_id', issue.id);

          return {
            ...issue,
            upvote_count: count || 0,
          };
        })
      );

      const totalUpvotes = issuesWithUpvotes.reduce(
        (sum, issue) => sum + issue.upvote_count,
        0
      );

      setStats({
        totalIssues: issuesWithUpvotes.length,
        openIssues: issuesWithUpvotes.filter((i) => i.status === 'OPEN').length,
        resolvedIssues: issuesWithUpvotes.filter((i) => i.status === 'RESOLVED').length,
        totalUpvotes,
      });

      setUserIssues(issuesWithUpvotes);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function getAchievementLevel() {
    if (stats.totalIssues >= 10) return 'Gold Reporter';
    if (stats.totalIssues >= 5) return 'Silver Reporter';
    if (stats.totalIssues >= 1) return 'Bronze Reporter';
    return 'New Citizen';
  }

  if (!user || profile?.role !== 'CITIZEN') {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your contributions and impact</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalIssues}</h3>
                <p className="text-gray-600">Total Issues</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-yellow-600" />
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

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUpvotes}</h3>
                <p className="text-gray-600">Total Upvotes</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{getAchievementLevel()}</h2>
                  <p className="text-blue-100">
                    {stats.totalIssues < 1
                      ? 'Report your first issue to get started!'
                      : stats.totalIssues < 5
                      ? `${5 - stats.totalIssues} more issues to reach Silver!`
                      : stats.totalIssues < 10
                      ? `${10 - stats.totalIssues} more issues to reach Gold!`
                      : 'You are a champion of civic engagement!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Reported Issues</h2>

              {userIssues.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't reported any issues yet</p>
                  <button
                    onClick={() => navigate('/report')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    Report Your First Issue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => navigate(`/issues/${issue.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            issue.status === 'RESOLVED'
                              ? 'bg-green-100 text-green-700'
                              : issue.status === 'IN_PROGRESS'
                              ? 'bg-orange-100 text-orange-700'
                              : issue.status === 'VERIFIED'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="px-2 py-1 bg-gray-100 rounded">{issue.category}</span>
                          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{issue.upvote_count} upvotes</span>
                        </div>
                      </div>
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
