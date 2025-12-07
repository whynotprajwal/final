import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Building2, AlertCircle } from 'lucide-react';

export default function AuthorityLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError, data } = await supabase.auth.signInWithPassword(
        email,
        password
      );

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          setError('Could not verify user role');
          setLoading(false);
          return;
        }

        if (profile.role !== 'AUTHORITY') {
          setError('Only Authority members can access this portal');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        navigate('/dashboard/authority');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">Authority Portal</h1>
          <p className="text-blue-100 text-center">VoiceUp - Civic Issue Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Authority Email</span>
              </div>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="your.authority@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Password</span>
              </div>
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In as Authority'}
          </button>
        </form>

        <div className="border-t border-gray-200 px-8 py-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Authority Features:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• View assigned civic issues</li>
              <li>• Verify issue reports</li>
              <li>• Update resolution status</li>
              <li>• Add progress comments</li>
              <li>• Track issue history</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Not an Authority member?
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
            >
              Citizen Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
