import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Send login request to backend to get the token
            const response = await axios.post("http://127.0.0.1:8000/user/login/", {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);  // Store token in localStorage

            // Fetch user role using the token
            const roleResponse = await axios.get("http://127.0.0.1:8000/user/profile/", {
                headers: { Authorization: `Token ${token}` }, // Include token in the Authorization header
            });

            // Save role in localStorage
            const role = roleResponse.data.role;  // Assuming the response contains the role
            localStorage.setItem("role", role);  // Store the role in localStorage

            // Redirect to service requests page
            navigate("/service_requests/my_requests");
        } catch (err) {
            setError("Invalid credentials or other error.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
