import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
