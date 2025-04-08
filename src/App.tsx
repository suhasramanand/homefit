
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Results from '@/pages/Results';
import ApartmentDetails from '@/pages/ApartmentDetails';
import Questionnaire from '@/pages/Questionnaire';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';
import About from '@/pages/About';
import BrokerDashboard from '@/pages/BrokerDashboard';
import BrokerListings from '@/pages/BrokerListings';
import BrokerProfile from '@/pages/broker/BrokerProfile';
import BrokerSettings from '@/pages/broker/BrokerSettings';
import BrokerInquiries from '@/pages/broker/BrokerInquiries';
import AddListing from '@/pages/AddListing';
import AdminDashboard from '@/pages/AdminDashboard';
import BrokerManagement from '@/pages/admin/BrokerManagement';
import UserManagement from '@/pages/admin/UserManagement';
import AdminListings from '@/pages/admin/AdminListings';
import AdminProfile from '@/pages/admin/AdminProfile';
import AdminSettings from '@/pages/admin/AdminSettings';
import NotFound from '@/pages/NotFound';
import PrivateRoute from '@/components/PrivateRoute';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

function App() {
  const { toast } = useToast();
  
  useEffect(() => {
    // Create admin account on app startup
    fetch('http://localhost:5000/api/auth/setup-admin')
      .then(res => res.json())
      .then(data => {
        if (data.credentials) {
          console.log('Default admin credentials created:', data.credentials);
          toast({
            title: "Admin Account Created",
            description: `Email: ${data.credentials.email}, Password: ${data.credentials.password}`,
            duration: 10000,
          });
        }
      })
      .catch(err => console.error('Error setting up admin:', err));
  }, [toast]);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/results" element={<Results />} />
      <Route path="/apartment/:id" element={<ApartmentDetails />} />
      <Route path="/about" element={<About />} />
      
      {/* Protected routes */}
      <Route path="/profile" element={
        <PrivateRoute element={<Profile />} />
      } />
      <Route path="/favorites" element={
        <PrivateRoute element={<Favorites />} />
      } />
      
      {/* Broker routes */}
      <Route path="/broker" element={
        <PrivateRoute element={<BrokerDashboard />} roles={['broker']} />
      } />
      <Route path="/broker/listings" element={
        <PrivateRoute element={<BrokerListings />} roles={['broker']} />
      } />
      <Route path="/broker/add-listing" element={
        <PrivateRoute element={<AddListing />} roles={['broker']} />
      } />
      <Route path="/broker/profile" element={
        <PrivateRoute element={<BrokerProfile />} roles={['broker']} />
      } />
      <Route path="/broker/settings" element={
        <PrivateRoute element={<BrokerSettings />} roles={['broker']} />
      } />
      <Route path="/broker/inquiries" element={
        <PrivateRoute element={<BrokerInquiries />} roles={['broker']} />
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <PrivateRoute element={<AdminDashboard />} roles={['admin']} />
      } />
      <Route path="/admin/brokers" element={
        <PrivateRoute element={<BrokerManagement />} roles={['admin']} />
      } />
      <Route path="/admin/users" element={
        <PrivateRoute element={<UserManagement />} roles={['admin']} />
      } />
      <Route path="/admin/listings" element={
        <PrivateRoute element={<AdminListings />} roles={['admin']} />
      } />
      <Route path="/admin/profile" element={
        <PrivateRoute element={<AdminProfile />} roles={['admin']} />
      } />
      <Route path="/admin/settings" element={
        <PrivateRoute element={<AdminSettings />} roles={['admin']} />
      } />
      
      {/* Fallback routes */}
      <Route path="/index" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
