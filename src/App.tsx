import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useLocation } from './hooks/useNavigate';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import IssuesList from './pages/IssuesList';
import IssueDetails from './pages/IssueDetails';
import ReportIssue from './pages/ReportIssue';
import CitizenDashboard from './pages/CitizenDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AuthorityLogin from './pages/AuthorityLogin';
import AdminDashboard from './pages/AdminDashboard';

function Router() {
  const [location, setLocation] = useState(useLocation());

  useEffect(() => {
    const handleHashChange = () => {
      setLocation(useLocation());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (location === '/' || location === '') {
    return <Landing />;
  }

  if (location === '/login') {
    return <Login />;
  }

  if (location === '/signup') {
    return <Signup />;
  }

  if (location === '/issues') {
    return <IssuesList />;
  }

  if (location.startsWith('/issues/')) {
    return <IssueDetails />;
  }

  if (location === '/report') {
    return <ReportIssue />;
  }

  if (location === '/dashboard/citizen') {
    return <CitizenDashboard />;
  }

    if (location === '/authority/login') {
    return <AuthorityLogin />;
  }

  if (location === '/dashboard/authority') {
    return <AuthorityDashboard />;
  }

  if (location === '/dashboard/admin') {
    return <AdminDashboard />;
  }

  return <Landing />;
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
