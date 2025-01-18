import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';

const token = localStorage.getItem('token');
console.log('Token present:', !!token);
console.log('Token value:', token);

// Decode token to check admin status
const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
console.log('Decoded token:', decoded);

const client = new GraphQLClient('http://localhost:8585/graphql/scooters', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
});

const CREATE_SCOOTER_MUTATION = gql`
    mutation CreateScooter($customid: String!, $status: String!, $speed: Float!, $battery_level: Float!, $coordinates: [Float!]!, $station: String!, $designated_parking: Boolean!) {
        scooterCreateOne(record: {
            customid: $customid,
            status: $status,
            speed: $speed,
            battery_level: $battery_level,
            current_location: {
                type: "Point",
                coordinates: $coordinates
            },
            at_station: $station,
            designated_parking: $designated_parking
        }) {
            _id
            customid
            status
            speed
            battery_level
            current_location {
                type
                coordinates
            }
        }
    }
`;

const CreateScooter = () => {
    const [customid, setCustomid] = useState('');
    const [status, setStatus] = useState('');
    const [speed, setSpeed] = useState('');
    const [batteryLevel, setBatteryLevel] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [station, setStation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [designatedParking, setDesignatedParking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // headers debug logging
        console.log("Request Headers:", {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        
        const [longitude, latitude] = coordinates.split(',').map(Number);
        
        // Log form values before sending
        // console.log('Form Values:', {
        //     customid,
        //     status,
        //     speed,
        //     batteryLevel,
        //     coordinates
        // });
        const variables = {
            customid,
            status,
            speed: Number(speed),
            battery_level: Number(batteryLevel),
            coordinates: [longitude, latitude],
            station,
            designated_parking: designatedParking 
        };

        console.log("CREATE_SCOOTER_MUTATION", CREATE_SCOOTER_MUTATION)
        console.log('Request Data.record:', variables);

        try {
            const data = await client.request(CREATE_SCOOTER_MUTATION, variables);
            console.log('Response Data:', data);
            navigate('/scooters');
        } catch (error) {
            console.error('Error creating scooter:', error);
            if (error.response) {
                console.error('Error response:', error.response);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                console.error('Error data:', error.response.data);
                if (error.response.data) {
                    try {
                        const errorData = JSON.parse(error.response.data);
                        console.error('Error message:', errorData.message);
                    } catch (e) {
                        console.error('Error parsing error data:', e);
                    }
                }
            }
            setError('Failed to create scooter. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create New Scooter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="customid">Custom ID:</label>
                    <input
                        id="customid"
                        type="text"
                        value={customid}
                        onChange={(e) => setCustomid(e.target.value)}
                        required
                    />
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="">Pick value</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                    <label htmlFor="speed">Speed:</label>
                    <input
                        id="speed"
                        type="number"
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="batteryLevel">Battery Level:</label>
                    <input
                        id="batteryLevel"
                        type="number"
                        value={batteryLevel}
                        onChange={(e) => setBatteryLevel(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="coordinates">Coordinates (longitude, latitude):</label>
                    <input
                        id="coordinates"
                        type="text"
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="station">Station:</label>
                    <input
                        id="station"
                        type="text"
                        value={station}
                        onChange={(e) => setStation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="designatedParking">
                        <input
                            id="designatedParking"
                            type="checkbox"
                            checked={designatedParking}
                            onChange={(e) => setDesignatedParking(e.target.checked)}
                        />
                        Designated Parking
                    </label>
                </div>
                <button type="submit">Create Scooter</button>
            </form>
        </div>
    );
};

export default CreateScooter;

// Flow: Form Input → React State → Variables Object → GraphQL Mutation → Server
