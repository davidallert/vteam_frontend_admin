import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buttons from '../styles/shared/buttons.module.css'
import layout from '../styles/shared/layout.module.css'

//Redux Slice
import { useSelector, useDispatch } from 'react-redux';
import { fetchScooters } from '../redux-slices/ScootersSlice';


function DisplayScooters() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: scooters, status } = useSelector((state) => state.scooters);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchScooters());
        }
    }, [status, dispatch]);
    
        if (status === 'loading') {
            return <p>Loading scooters...</p>;
        }

        if (status === 'failed') {
            return <p>Failed to fetch scooters. Please try again.</p>;
        }

    return (
        <div>
            <h2>Scooters Management</h2>
            {scooters.length === 0 && <p>Loading scooters...</p>}
            {scooters.length > 0 && (
                <div className={layout.wrapper}>
                    <ul className={layout.ul}>
                        {scooters.map((scooter) => (
                            <li key={scooter._id} className={layout.li}>
                                <h2><strong>Scooter:</strong> {scooter.customid}</h2>
                                <p><strong>Database ID:</strong> {scooter._id}</p>
                                <p><strong>Status:</strong> {scooter.status}</p>
                                <p><strong>Battery Level:</strong> {scooter.battery_level}%</p>
                                <p><strong>Station:</strong> {scooter.at_station}</p>
                                <p><strong>Designated parking:</strong> {String(scooter.designated_parking)}</p>
                                <p>
                                    <strong>Location:</strong> {scooter.current_location.type} - [
                                    {`${scooter.current_location.coordinates[0].toFixed(4)}, ${scooter.current_location.coordinates[1].toFixed(4)}`}]
                                </p>

                                <button className={buttons.buttonPrimary} onClick={() => navigate('/delete-scooter', { 
                                    state: { scooterCustomId: scooter.customid } 
                                })}>Delete Scooter</button>

                                {/* <hr /> */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
                <button className={buttons.buttonSecondary} onClick={() => navigate('/create-scooter')}>Create New Scooter</button> 
        </div>
    );
}

export default DisplayScooters;
