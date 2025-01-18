import React, { useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';


function DisplayScooters() {
    const [scooters, setScooters] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Define the GraphQL client with the Authorization header
    const client = new GraphQLClient('http://localhost:8585/graphql/scooters', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    // Define the GraphQL query to fetch scooters
    const SCOOTERS_QUERY = gql`
        query {
            scooters {
                _id
                status
                customid
                speed
                battery_level
                at_station
                designated_parking
                current_location {
                    type
                    coordinates
                }
            }
        }
    `;

    // Fetch scooters when the component mounts
    useEffect(() => {
        const fetchScooters = async () => {
            try {
                const data = await client.request(SCOOTERS_QUERY);
                setScooters(data.scooters);
                console.log('data', data)
            } catch (error) {
                console.error('Error fetching scooters:', error);
                setError('Failed to fetch scooters. Please try again.');
            }
        };

        fetchScooters();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div>
            <h2>Scooters Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && scooters.length === 0 && <p>Loading scooters...</p>}
            {scooters.length > 0 && (
                <ul>
                    {scooters.map((scooter) => (
                        <li key={scooter._id}>
                            <p><strong>ID:</strong> {scooter._id}</p>
                            <p><strong>customid:</strong> {scooter.customid}</p>
                            <p><strong>Status:</strong> {scooter.status}</p>
                            <p><strong>Speed:</strong> {scooter.speed} km/h</p>
                            <p><strong>Battery Level:</strong> {scooter.battery_level}%</p>
                            <p><strong>Station:</strong> {scooter.at_station}</p>
                            <p><strong>Designated parking:</strong> {String(scooter.designated_parking)}</p>
                            <p>
                                <strong>Location:</strong> {scooter.current_location.type} - [
                                {scooter.current_location.coordinates.join(', ')}]
                            </p>

                            <button onClick={() => navigate('/delete-scooter', { 
                                state: { scooterCustomId: scooter.customid } 
                            })}>Delete Scooter</button>

                            <hr />
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate('/create-scooter')}>Create New Scooter</button>
        </div>
    );
}

export default DisplayScooters;
