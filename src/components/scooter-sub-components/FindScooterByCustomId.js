import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { useLocation } from 'react-router-dom';
import layout from '../../styles/shared/layout.module.css';
import buttons from '../../styles/shared/buttons.module.css';

const token = localStorage.getItem('token');
console.log('Token present:', !!token);
console.log('Token value:', token);



// Decode token to check admin status
// const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
// console.log('Decoded token:', decoded);

const client = new GraphQLClient('http://localhost:8585/graphql/scooters', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
});

const FIND_SCOOTER_QUERY = gql`
    query FindScooter($scooterCustomId: String!) {
        scooterById(customid: $scooterCustomId) {
            _id
            status
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

const FindScooter = () => {
    const [error, setError] = useState('');
    const [scooter, setScooter] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const searchScooterCustomId = location.state?.scooterCustomId;
    // console.log("searchScooterCustomId", searchScooterCustomId)

    const handleSearch = async () => {
        try {
            const variables = {
                scooterCustomId: searchScooterCustomId
            };

            const data = await client.request(FIND_SCOOTER_QUERY, variables);
            // console.log('Searched scooter data:', data);
            setScooter(data.scooterById);
        } catch (error) {
            console.error('Error searching scooter by email:', error);
            setError('Failed to search scooter by email');
        }
    };

    useEffect(() => {
        if (searchScooterCustomId) {
            handleSearch();
        }
    }, [searchScooterCustomId]);

    return (
        <div>
            <h2>Search Scooter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && !scooter && <p>Loading scooter...</p>}
            {scooter && (
                <div className={layout.wrapper}>
                    <ul className={layout.ul}>
                        <li key={scooter._id} className={layout.li}>
                            <h2>Id: {scooter._id}</h2>
                            <h2><strong>Custom id:</strong> {searchScooterCustomId}</h2>
                            <p><strong>Status:</strong> {scooter.status}</p>
                            <p><strong>Battery level:</strong> {scooter.battery_level}</p>
                            <p><strong>Station:</strong> {scooter.at_station}</p>
                            <p><strong>Designated parking:</strong> {String(scooter.designated_parking)}</p>
                            <p>
                                <strong>Location:</strong> {scooter.current_location.type} - [
                                {`${scooter.current_location.coordinates[0].toFixed(4)}, ${scooter.current_location.coordinates[1].toFixed(4)}`}]
                            </p>

                            <button className={buttons.buttonPrimary} onClick={() => navigate('/delete-scooter', { 
                                    state: { scooterCustomId: searchScooterCustomId } 
                                })}>Delete Scooter</button>
                        </li>
                    </ul>
                </div>
            )}
            <button className={buttons.buttonSecondary} onClick={() => navigate('/scooters')}>Get Back</button>
        </div>
    );
};

export default FindScooter;