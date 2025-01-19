import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ScootersPage from './ScootersPage';
import CustomersPage from './CustomersPage';
import form from '../styles/shared/form.module.css'

const AdminDashboard = () => {
    const location = useLocation();
    const message = location.state?.message;
    const [selectedPage, setSelectedPage] = useState('home');

    const handlePageChange = (event) => {
        setSelectedPage(event.target.value);
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {message && <p>{message}</p>}
            <select className={form.input} value={selectedPage} onChange={handlePageChange}>
                <option value="">Select a page</option>
                <option value="scooters">scooters</option>
                <option value="Customers Management">Customers Management</option>
                <option value="Map">Map</option>
                <option value="Overview">Overview</option>
                <option value="Charging Stations">Charging Stations</option>
                <option value="Parking Spots Management">Parking Spots Management</option>
                <option value="Bike Management">Bike Management</option>
                <option value="Billing and Fees Management">Billing and Fees Management</option>
                <option value="Map View">Map View</option>
            </select>
            {selectedPage === 'scooters' && <ScootersPage />}
            {selectedPage === 'Customers Management' && <CustomersPage />}
            {selectedPage === 'Map' && <p>Welcome to the map!</p>}
            {selectedPage === 'Overview' && <p>Manage Overview here.</p>}
            {selectedPage === 'Charging Stations' && <p>Manage Charging Stations here.</p>}
            {selectedPage === 'Parking Spots Management' && <p>Adjust Parking Spots Management here.</p>}
            {selectedPage === 'Billing and Fees Management' && <p>Manage Billing and Fees here.</p>}
            {selectedPage === 'Map View' && <p>View the map here.</p>}
        </div>
    );
};

export default AdminDashboard;