import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';
import ScootersPage from './components/ScootersPage';
import CreateScooter from './components/scooter-sub-components/CreateScooter';
import DeleteScooter from './components/scooter-sub-components/DeleteScooter';

import CustomersPage from './components/CustomersPage';
import DeleteUser from './components/user-sub-components/DeleteUser';
import CreateUser from './components/user-sub-components/CreateUser';
import UpdateUserInfo from './components/user-sub-components/UpdateUserInfo';
import FindUserByEmail from './components/user-sub-components/FindUserByEmail';
import FindScooterByCustomId from './components/scooter-sub-components/FindScooterByCustomId';

import MapOverview from './components/MapOverview';



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
            <Route path="/delete-scooter" element={<DeleteScooter />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/delete-user" element={<DeleteUser />} />
            <Route path="/create-user" element={<CreateUser/>} />
            <Route path="/update-user-info" element={<UpdateUserInfo/>} />
            <Route path="/find-user-by-email" element={<FindUserByEmail/>} />
            <Route path="/map-overview" element={<MapOverview/>} />
            <Route path="/find-scooter-by-customId" element={<FindScooterByCustomId/>} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
