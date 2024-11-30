import React, { useEffect, useState } from "react";
import axios from "axios";
import './ServiceViewUser.css'; // Assuming you will use this CSS file for styling

const ServiceViewUser = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/service_requests/service_requests/my_requests/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setServiceRequests(response.data);
      })
      .catch(() => {
        setError("Error fetching service requests");
      });
  }, []);

  const handleDelete = (requestId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`http://127.0.0.1:8000/service_requests/service_requests/${requestId}/delete/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        // Remove the deleted request from the list
        setServiceRequests((prevRequests) =>
          prevRequests.filter((request) => request.request_id !== requestId)
        );
      })
      .catch(() => {
        setError("Error deleting service request");
      });
  };

  return (
    <div className="service-view-container">
      <h2 className="service-view-title">Your Service Requests</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="service-list">
        {serviceRequests.length > 0 ? (
          serviceRequests.map((request) => (
            <div key={request.request_id} className="service-item">
              <h3 className="service-item-title">{request.title}</h3>
              <p className="service-item-description">
                <strong>Description:</strong> {request.description}
              </p>
              <p className="service-item-status">
                <strong>Status:</strong> {request.status}
              </p>

              {/* Display the status updates only if it's an array */}
              {Array.isArray(request.status_updates) && request.status_updates.length > 0 && (
                <div className="status-updates">
                  <h4>Status Updates:</h4>
                  <ul className="status-updates-list">
                    {request.status_updates.map((update, index) => (
                      <li key={index} className="status-update-item">
                        <p><strong>Status:</strong> {update.status}</p>
                        <p><strong>Updated At:</strong> {new Date(update.updated_at).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Display image if available */}
              {request.image && (
                <div className="image-container">
                  <strong>Image:</strong>
                  <img
      src={`http://127.0.0.1:8000/${request.image}`}
      alt={request.title}
                    className="service-item-image"
                  />
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(request.request_id)}
                className="delete-button"
              >
                Delete Request
              </button>
            </div>
          ))
        ) : (
          <p>No service requests found.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceViewUser;
