import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ReportPage } from './pages/ReportPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Spinner } from './components/Spinner';
import { Page, User, Report, ReportStatus } from './types';
import { generateMockReports } from './services/geminiService';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load data from localStorage on initial mount
    const storedUser = localStorage.getItem('civic-connect-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedReports = localStorage.getItem('civic-connect-reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
      setIsLoading(false);
    } else {
      // Fetch initial data if nothing in localStorage
      const fetchInitialReports = async () => {
        setIsLoading(true);
        const initialReports = await generateMockReports(25);
        setReports(initialReports);
        localStorage.setItem('civic-connect-reports', JSON.stringify(initialReports));
        setIsLoading(false);
      };
      fetchInitialReports();
    }
  }, []);

  const handleNavigation = (newPage: Page) => {
    // Prevent access to protected pages if not logged in
    if (['report', 'my-reports', 'admin'].includes(newPage) && !user) {
      setPage('login');
    } else {
      setPage(newPage);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('civic-connect-user', JSON.stringify(loggedInUser));
    setPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('civic-connect-user');
    setPage('home');
  };

  const addReport = useCallback((newReportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'userName'>) => {
    if (!user) {
        alert("You must be logged in to submit a report.");
        setPage('login');
        return;
    }

    const newReport: Report = {
        ...newReportData,
        id: `report-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
    };

    setReports(prevReports => {
        const updatedReports = [newReport, ...prevReports];
        localStorage.setItem('civic-connect-reports', JSON.stringify(updatedReports));
        return updatedReports;
    });
    setPage('my-reports');
  }, [user]);

  const updateReportStatus = useCallback((reportId: string, newStatus: ReportStatus) => {
    setReports(prevReports => {
        const updatedReports = prevReports.map(report =>
            report.id === reportId ? { ...report, status: newStatus, updatedAt: new Date().toISOString() } : report
        );
        localStorage.setItem('civic-connect-reports', JSON.stringify(updatedReports));
        return updatedReports;
    });
  }, []);

  const renderPage = () => {
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }
    
    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
      case 'report':
        if (user) return <ReportPage user={user} addReport={addReport} />;
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
      case 'my-reports':
        if (user) return <MyReportsPage reports={reports} user={user} />;
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
      case 'admin':
        if (user?.role === 'admin') return <AdminDashboardPage reports={reports} onUpdateStatus={updateReportStatus} />;
        return <HomePage onNavigate={handleNavigation} />; // Or a 'Not Authorized' page
      case 'signup':
         // For simplicity, signup will just log in a new citizen user
         return <LoginPage onLogin={handleLogin} onNavigate={handleNavigation} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header user={user} onNavigate={handleNavigation} onLogout={handleLogout} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;