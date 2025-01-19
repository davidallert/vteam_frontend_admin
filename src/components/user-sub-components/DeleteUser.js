import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { useLocation } from 'react-router-dom';

const token = localStorage.getItem('token');
console.log('Token present:', !!token);
console.log('Token value:', token);

// Decode token to check admin status
// const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
// console.log('Decoded token:', decoded);

const client = new GraphQLClient('http://localhost:8585/graphql/users', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
});

const DELETE_USER_MUTATION = gql`
    mutation DeleteUser($_id: ID!) {
        userRemoveById(_id: $_id) {
            _id
        }
    }
`;

const DeleteUser = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // console.log('Location state:', location.state);

    const userId = location.state?.userId;
    // console.log('user ID:', userId);

    const handleDelete = async () => {
        if (!userId) {
            setError('No user ID provided');
            return;
        }

        try {
            const variables = {
                _id: userId
            };

            const data = await client.request(DELETE_USER_MUTATION, variables);
            console.log('Delete response:', data);
            navigate('/customers');
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        }
    };

    return (
        <div>
            <h2>Delete User</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Are you sure you want to delete user {userId}?</p>
            <button onClick={handleDelete}>Confirm Delete</button>
            <button onClick={() => navigate('/customers')}>Cancel</button>
        </div>
    );
};

export default DeleteUser;