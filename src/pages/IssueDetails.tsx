import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  ThumbsUp,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface IssueDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    name: string;
    role: string;
  };
}

interface StatusHistory {
  id: string;
  status: string;
  created_at: string;
  comment: string | null;
  profiles: {
    name: string;
    role: string;
  };
}

const statusSteps = ['OPEN', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED'];

export default function IssueDetails() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [verificationCount, setVerificationCount] = useState(0);
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const issueId = window.location.hash.split('/')[2];

  useEffect(() => {
    if (user && issueId) {
      loadIssueDetails();
      loadComments();
      loadStatusHistory();
      loadUpvotes();
      loadVerifications();
    }
  }, [user, issueId]);

  async function loadIssueDetails() {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq('id', issueId)
        .maybeSingle();

      if (error) throw error;
      setIssue(data);
    } catch (error) {
      console.error('Error loading issue:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (name, role)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  async function loadStatusHistory() {
    try {
      const { data, error } = await supabase
        .from('status_history')
        .select(`
          *,
          profiles:changed_by (name, role)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStatusHistory(data || []);
    } catch (error) {
      console.error('Error loading status history:', error);
    }
  }

  async function loadUpvotes() {
    try {
      const { count } = await supabase
        .from('upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('issue_id', issueId);

      const { data: userUpvote } = await supabase
        .from('upvotes')
        .select('id')
        .eq('issue_id', issueId)
        .eq('user_id', user?.id || '')
        .maybeSingle();

      setUpvoteCount(count || 0);
      setUserUpvoted(!!userUpvote);
    } catch (error) {
      console.error('Error loading upvotes:', error);
    }
  }

  async function loadVerifications() {
    try {
      const { count } = await supabase
        .from('verifications')
        .select('*', { count: 'exact', head: true })
        .eq('issue_id', issueId);

      const { data: userVerification } = await supabase
        .from('verifications')
        .select('id')
        .eq('issue_id', issueId)
        .eq('user_id', user?.id || '')
        .maybeSingle();

      setVerificationCount(count || 0);
      setUserVerified(!!userVerification);
    } catch (error) {
      console.error('Error loading verifications:', error);
    }
  }

  async function handleUpvote() {
    if (!user) return;

    try {
      if (userUpvoted) {
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
      loadUpvotes();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  }

  async function handleVerify() {
    if (!user || userVerified) return;

    try {
      await supabase.from('verifications').insert({
        issue_id: issueId,
        user_id: user.id,
      });

      const newVerificationCount = verificationCount + 1;
      if (newVerificationCount >= 3 && issue?.status === 'OPEN') {
        await supabase
          .from('issues')
          .update({ status: 'VERIFIED' })
          .eq('id', issueId);
        loadIssueDetails();
        loadStatusHistory();
      }

      loadVerifications();
    } catch (error) {
      console.error('Error verifying:', error);
    }
  }

  async function handleSubmitComment() {
    if (!user || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await supabase.from('comments').insert({
        issue_id: issueId,
        user_id: user.id,
        content: newComment.trim(),
      });

      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Issue not found</p>
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

  const currentStepIndex = statusSteps.indexOf(issue.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate('/issues')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Issues</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {issue.image_url && (
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {issue.category}
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{issue.profiles?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                    userUpvoted
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{upvoteCount}</span>
                </button>
                {!userVerified && issue.status === 'OPEN' && (
                  <button
                    onClick={handleVerify}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify ({verificationCount})</span>
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-start space-x-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{issue.location}</span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {statusSteps.map((status, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const historyItem = statusHistory.find((h) => h.status === status);

                  return (
                    <div key={status} className="relative flex items-start space-x-4 mb-6">
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </h3>
                        {historyItem && (
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(historyItem.created_at).toLocaleString()} by{' '}
                            {historyItem.profiles.name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Comments ({comments.length})</span>
              </h2>

              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {comment.profiles.name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                          {comment.profiles.role}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
