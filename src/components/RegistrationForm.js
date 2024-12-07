import React from 'react';

const RegistrationForm = () => {
    return (
        <div className="form-div">
            <h1>Sign up as an Admin</h1>
            <form className="form-elements-div">
                <div>
                    <label>Username:</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
