import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import {
  Plus,
  Filter,
  TrendingUp,
  MapPin,
  Calendar,
  ThumbsUp,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  image_url: string | null;
  created_at: string;
  upvote_count?: number;
  user_upvoted?: boolean;
  profiles?: {
    name: string;
  };
}

const statusColors = {
  OPEN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  VERIFIED: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-200',
  RESOLVED: 'bg-green-100 text-green-800 border-green-200',
};

const categoryColors = {
  Garbage: 'bg-red-100 text-red-700',
  Roads: 'bg-slate-100 text-slate-700',
  Water: 'bg-blue-100 text-blue-700',
  Electricity: 'bg-yellow-100 text-yellow-700',
  Safety: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function IssuesList() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    if (user) {
      loadIssues();
    } else {
      setLoading(false);
    }
  }, [user, categoryFilter, statusFilter, sortBy]);

  async function loadIssues() {
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          profiles:user_id (name)
        `);

      if (categoryFilter !== 'All') {
        query = query.eq('category', categoryFilter);
      }

      if (statusFilter !== 'All') {
        query = query.eq('status', statusFilter);
      }

      if (sortBy === 'latest') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      const issuesWithUpvotes = await Promise.all(
        (data || []).map(async (issue) => {
          const { count } = await supabase
            .from('upvotes')
            .select('*', { count: 'exact', head: true })
            .eq('issue_id', issue.id);

          const { data: userUpvote } = await supabase
            .from('upvotes')
            .select('id')
            .eq('issue_id', issue.id)
            .eq('user_id', user?.id || '')
            .maybeSingle();

          return {
            ...issue,
            upvote_count: count || 0,
            user_upvoted: !!userUpvote,
          };
        })
      );

      if (sortBy === 'upvotes') {
        issuesWithUpvotes.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
      }

      setIssues(issuesWithUpvotes);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpvote(issueId: string, currentlyUpvoted: boolean) {
    if (!user) return;

    try {
      if (currentlyUpvoted) {
        await supabase
          .from('upvotes')
          .delete()
          .eq('issue_id', issueId)
          .eq('user_id', user.id);
      } else {
        await supabase.from('upvotes').insert({
          issue_id: issueId,
          user_id: user.id,
        });
      }

      loadIssues();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view issues</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VoiceUp</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden sm:block">
                {profile?.name} ({profile?.role})
              </span>
              {profile?.role === 'CITIZEN' && (
                <button
                  onClick={() => navigate('/dashboard/citizen')}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              )}
              {profile?.role === 'AUTHORITY' && (
                <button
                  onClick={() => navigate('/dashboard/authority')}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              )}
              {profile?.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/dashboard/admin')}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Civic Issues</h1>
            <p className="text-gray-600 mt-1">Browse and support community issues</p>
          </div>
          <button
            onClick={() => navigate('/report')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Report Issue</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters & Sort</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Garbage">Garbage</option>
                <option value="Roads">Roads</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Safety">Safety</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="VERIFIED">Verified</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Latest First</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600">No issues found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => navigate(`/issues/${issue.id}`)}
              >
                {issue.image_url && (
                  <img
                    src={issue.image_url}
                    alt={issue.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        categoryColors[issue.category as keyof typeof categoryColors]
                      }`}
                    >
                      {issue.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        statusColors[issue.status as keyof typeof statusColors]
                      }`}
                    >
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {issue.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(issue.id, issue.user_upvoted || false);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition ${
                        issue.user_upvoted
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{issue.upvote_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
