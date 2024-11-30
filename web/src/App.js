import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ServiceForm from "./components/ServiceForm";
import ServiceViewUser from "./components/ServiceViewUser";
import CustomerProfile from "./components/CustomerProfile";
import AdminSupportRegister from "./components/AdminSupportRegister"; // New Component for Support Registration
import ServiceRequestManagement from "./components/ServiceRequestManagement"; // New Component for ServiceRequestManagement

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get the user role from the localStorage token or a separate API call if needed
    const token = localStorage.getItem("token");
    if (token) {
      // Assuming role is in the token payload or fetched via API after login
      const userRole = localStorage.getItem("role");
      setRole(userRole);  // Set the role
    }
  }, []);

  return (
    <Router>
      <nav>
        {/* Common navigation links */}
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>

        {/* Role-based links */}
        {role === "customer" && (
          <>
            <Link to="/service_requests/new">New Service Request</Link>
            <Link to="/service_requests/my_requests">My Service Requests</Link>
            <Link to="/customer/profile">Profile</Link>
          </>
        )}

        {role === "support" && (
          <>
            <Link to="/service_requests/all">Manage Service Requests</Link>
            <Link to="/customer/profile">Profile</Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin/support/register">Register Support</Link>
            <Link to="/service_requests/all">Manage Service Requests</Link>
            <Link to="/customer/profile">Profile</Link>
          </>
        )}
      </nav>

      <Routes>
        {/* Common routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Role-based routes */}
        {role === "customer" && (
          <>
            <Route path="/service_requests/new" element={<ServiceForm />} />
            <Route path="/service_requests/my_requests" element={<ServiceViewUser />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </>
        )}

        {role === "support" && (
          <>
            <Route path="/service_requests/all" element={<ServiceRequestManagement />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </>
        )}

        {role === "admin" && (
          <>
            <Route path="/admin/support/register" element={<AdminSupportRegister />} />
            <Route path="/service_requests/all" element={<ServiceRequestManagement />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
