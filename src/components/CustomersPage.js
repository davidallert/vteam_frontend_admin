import React, { useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';


function DisplayUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // Define the GraphQL client with the Authorization header
    const client = new GraphQLClient('http://localhost:8585/graphql/users', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    // Define the GraphQL query to fetch users
    const USERS_QUERY = gql`
      query {
        usersData {
            _id
            email
            name
            surname
            admin
            amount
        }
      }
    `;

    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await client.request(USERS_QUERY);
                setUsers(data.usersData);
                console.log('data', data)
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users. Please try again.');
            }
        };

        fetchUsers();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div>
            <h2>Users Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && users.length === 0 && <p>Loading users...</p>}
            {users.length > 0 && (
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>
                            <p><strong>ID:</strong> {user._id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Admin:</strong> {String(user.admin)}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Surname:</strong> {user.surname}</p>
                            <p><strong>Amount:</strong> {user.amount}</p>

                            <button onClick={() => navigate('/delete-user', { 
                                state: { userId: user._id } 
                            })}>Delete User</button>

                            <hr />
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate('/create-user')}>Register New User</button>
        </div>
    );
}

export default DisplayUsers;
