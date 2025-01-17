import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';
import ScootersPage from './components/ScootersPage';
import CreateScooter from './components/scooter-sub-components/CreateScooter';

function App() {
  return (
    <div className="App">
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<AdminLoginForm />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/scooters" element={<ScootersPage />} />
            <Route path="/create-scooter" element={<CreateScooter />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
