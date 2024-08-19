import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); 

        
        if (!email || !password) {
            setMessage('Please enter both email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
            }, { withCredentials: true }); // Include credentials with the request

            // Check if login is successful and handle the response
            if (response.status === 200) {
                alert("Login successful");
                setMessage('Login successful'); // Set success message
                
                // clear the from 
                setEmail('');
                setPassword('');
            }

        } catch (error) {
            // Handle login errors
            console.error("Login failed: ", error);
            setMessage('Login failed. Please check your credentials and try again.'); // Set error message
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button className="btn btn-primary w-100" type="submit">
                                    Login
                                </button>
                                {message && <p className="mt-3  text-center bg-success">{message}</p>} {/* Display the message */}
                                <div className="text-center mt-3">
                                    <p>Don't have an account?</p>
                                    <Link to="/" className="btn btn-secondary">Register Here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
