import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import MarketValuePage from './components/MarketValuePage';
import CompanyDetailsPage from './components/CompanyDetailsPage';
import ProfilePage from './components/ProfilePage';
import PlacementsPage from './components/PlacementsPage';
import AssessmentPage from './components/AssessmentPage';
import MentorshipPage from './components/MentorshipPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/placements"
                    element={
                        <ProtectedRoute>
                            <PlacementsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/assessment"
                    element={
                        <ProtectedRoute>
                            <AssessmentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentors"
                    element={
                        <ProtectedRoute>
                            <MentorshipPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/market-value"
                    element={
                        <ProtectedRoute>
                            <MarketValuePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/company/:id"
                    element={
                        <ProtectedRoute>
                            <CompanyDetailsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
