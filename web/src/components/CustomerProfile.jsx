import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return; // If no token, don't try fetching

        axios
            .get("http://127.0.0.1:8000/user/profile/", {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                setProfile(response.data); // Store the fetched profile data
            })
            .catch((err) => {
                setError("Error fetching profile data");
            });
    }, []);

    return (
        <div className="container">
            <h2>Customer Profile</h2>
            {error && <p>{error}</p>}
            {profile ? (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>First Name:</strong> {profile.first_name}</p>
                    <p><strong>Last Name:</strong> {profile.last_name}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default CustomerProfile;
