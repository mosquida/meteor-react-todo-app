import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor';

export const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = (e) => {
        e.preventDefault();

        // Sets Meteor.user info
        Meteor.loginWithPassword(username, password);
    }

    return (
        <form onSubmit={login}> 
            <label htmlFor="username">Username: </label>
            <input 
                type="text" 
                name="username" 
                onChange={ e => setUsername(e.target.value) }
                value={username}
                required />

            <label htmlFor="username">Password: </label>
            <input 
                type="text" 
                name="password" 
                onChange={ e => setPassword(e.target.value)}
                value={password}
                required />

            <button className="button">Log in</button>
        </form>
    )
}
