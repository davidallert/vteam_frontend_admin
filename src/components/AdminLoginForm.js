import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
// import appImage from '../5.png';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [googleOAuthUrl, setGoogleOAuthUrl] = useState('');
    const navigate = useNavigate();

    const client = new GraphQLClient('http://localhost:8585/graphql/auth', {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const LOGIN_MUTATION = gql`
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password, admin: true) {
                message
                user {
                    email
                    admin
                }
                token
            }
        }
    `;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await client.request(LOGIN_MUTATION, { email, password });

            if (!data.login || !data.login.token) {
                setErrorMessage(data.login?.message || 'Invalid login credentials.');
                return;
            }

            const { token } = data.login;

            // To ensure that the token has admin: true before encoding it.
            // const decoded = JSON.parse(
            //     atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
            // );
            // console.log('Decoded Token:', decoded);

            localStorage.setItem('token', token);
            navigate('/admin-dashboard');
        } catch (error) {
            setErrorMessage(error.response?.errors?.[0]?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login-comp">
            {/* <img src={appImage} alt="App visual" className="scooter-img" /> */}
            <h2>Scooti.</h2>
            <h4>Admin Login</h4>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default Login;
