import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchScooters } from '../../redux-slices/ScootersSlice';



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

const DELETE_SCOOTER_MUTATION = gql`
    mutation DeleteScooter($customid: String!) {
        scooterDeleteById(customid: $customid)
    }
`;

const DeleteScooter = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // console.log('Location state:', location.state);

    const scooterId = location.state?.scooterCustomId;
    // console.log('Scooter ID:', scooterId);

    const handleDelete = async () => {
        if (!scooterId) {
            setError('No scooter ID provided');
            return;
        }

        try {
            const variables = {
                customid: scooterId
            };

            const data = await client.request(DELETE_SCOOTER_MUTATION, variables);
            console.log('Delete response:', data);
            dispatch(fetchScooters());
            navigate('/scooters');
        } catch (error) {
            console.error('Error deleting scooter:', error);
            setError('Failed to delete scooter');
        }
    };

    return (
        <div>
            <h2>Delete Scooter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Are you sure you want to delete scooter {scooterId}?</p>
            <button onClick={handleDelete}>Confirm Delete</button>
            <button onClick={() => navigate('/scooters')}>Cancel</button>
        </div>
    );
};

export default DeleteScooter;