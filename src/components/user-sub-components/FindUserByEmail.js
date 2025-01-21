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

const client = new GraphQLClient('http://localhost:8585/graphql/users', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
});

const FIND_USER_QUERY = gql`
    query FindUser($userEmail: String!) {
        userDataByEmail(email: $userEmail) {
            _id
            email
            name
            surname
            admin
            amount
        }
    }
`;

const FindUser = () => {
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const searchEmail = location.state?.userEmail;
    console.log("searchEmail", searchEmail)

    const handleSearch = async () => {
        try {
            const variables = {
                userEmail: searchEmail
            };

            const data = await client.request(FIND_USER_QUERY, variables);
            console.log('Searched user data:', data);
            setUser(data.userDataByEmail);
        } catch (error) {
            console.error('Error searching user by email:', error);
            setError('Failed to search user by email');
        }
    };

    useEffect(() => {
        if (searchEmail) {
            handleSearch();
        }
    }, [searchEmail]);

    return (
        <div>
            <h2>Search User</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && !user && <p>Loading user...</p>}
            {user && (
                <div className={layout.wrapper}>
                    <ul className={layout.ul}>
                        <li key={user._id} className={layout.li}>
                            <h2>Id: {user._id}</h2>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Admin:</strong> {String(user.admin)}</p>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Surname:</strong> {user.surname}</p>
                            <p><strong>Amount:</strong> {user.amount}</p>

                            <button className={buttons.buttonPrimary} onClick={() => navigate('/delete-user', { 
                                state: { userId: user._id } 
                            })}>Delete User</button>

                            <button className={buttons.buttonPrimary} onClick={() => navigate('/update-user-info', { 
                                state: { userId: user._id } 
                            })}>Update User</button>
                        </li>
                    </ul>
                </div>
            )}
            <button className={buttons.buttonSecondary} onClick={() => navigate('/customers')}>Get Back</button>
        </div>
    );
};

export default FindUser;