import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServiceForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [requestType, setRequestType] = useState("Installation"); // Default value for request type
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            return alert("Please log in first");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("request_type", requestType); // Include request type
        if (image) formData.append("image", image);

        try {
            await axios.post("http://127.0.0.1:8000/service_requests/service_requests/", formData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            navigate("/service_requests/my_requests"); // Redirect to the list of service requests
        } catch (err) {
            alert("Error creating service request");
        }
    };

    return (
        <div>
            <h2>Create Service Request</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <label>Request Type:</label>
                <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    required
                >
                    <option value="Installation">Installation</option>
                    <option value="Repair">Repair</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Billing Issue">Billing Issue</option>
                </select>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Create Service Request</button>
            </form>
        </div>
    );
};

export default ServiceForm;
