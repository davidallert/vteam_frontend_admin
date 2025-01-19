import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';

const token = localStorage.getItem('token');
console.log('Token present:', !!token);
console.log('Token value:', token);

// Decode token to check admin status
const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
console.log('Decoded token:', decoded);

const client = new GraphQLClient('http://localhost:8585/graphql/auth', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
});

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($email: String!, $password: String!, $admin: Boolean, $name: String, $surname: String, $amount: Float) {
        register(
            email: $email,
            password: $password,
            admin: $admin,
            name: $name,
            surname: $surname,
            amount: $amount
            ) {
            message
            user {
                email
            }
        }
    }
`;

const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [amount, setAmount] = useState('');
    const [admin, setAdmin] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // headers debug logging
        // console.log("Request Headers:", {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        // });

        // Log form values before sending
        // console.log('Form Values:', {
        //     email,
        //     name,
        //     surname,
        //     amount
        // });
        const variables = {
            email: email,
            password: password,
            admin: admin,
            name: name,
            surname: surname,
            amount: Number(amount)
        };

        console.log("CREATE_SCOOTER_MUTATION", CREATE_USER_MUTATION)
        console.log('Request variable:', variables);

        try {
            const data = await client.request(CREATE_USER_MUTATION, variables);
            console.log('Response Data:', data);
            navigate('/customers');
        } catch (error) {
            console.error('Error creating user:', error);
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
            setError('Failed to create user. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create New User</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="surname">Surname:</label>
                    <input
                        id="surname"
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="admin">
                        <input
                            id="admin"
                            type="checkbox"
                            checked={admin}
                            onChange={(e) => setAdmin(e.target.checked)}
                        />
                        Admin
                    </label>
                </div>
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default CreateUser;

// Flow: Form Input → React State → Variables Object → GraphQL Mutation → Server
