import React, { useState, useEffect } from "react";
import axios from "axios";
const ServiceRequestManagement = () => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({}); // Track status for each request
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  
    // Fetch service requests for Customer Service role
    useEffect(() => {
      const token = localStorage.getItem("token");
      axios
        .get("http://127.0.0.1:8000/service_requests/service_requests/all/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setServiceRequests(response.data);
          // Initialize statusUpdates object with current statuses
          const initialStatuses = response.data.reduce((acc, request) => {
            acc[request.request_id] = request.status;
            return acc;
          }, {});
          setStatusUpdates(initialStatuses);
        })
        .catch((err) => {
          setError("Error fetching service requests.");
        });
    }, []);
  
    // Handle status update for a service request
    const handleStatusUpdate = (serviceRequestId) => {
      const token = localStorage.getItem("token");
      const selectedStatus = statusUpdates[serviceRequestId];
  
      axios
        .post(
          `http://127.0.0.1:8000/service_requests/service_requests/${serviceRequestId}/status_update/`,
          { status: selectedStatus },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )
        .then((response) => {
          setMessage("Status updated successfully.");
          setError("");
          // Optionally, re-fetch the service requests to reflect the changes
          setServiceRequests(serviceRequests.map((request) =>
            request.request_id === serviceRequestId ? { ...request, status: selectedStatus } : request
          ));
        })
        .catch((err) => {
          setError("Error updating status.");
          setMessage("");
        });
    };
  
    // Handle change in status dropdown
    const handleStatusChange = (serviceRequestId, newStatus) => {
      setStatusUpdates({
        ...statusUpdates,
        [serviceRequestId]: newStatus, // Update the status for the specific service request
      });
    };
  
    return (
      <div>
        <h2>Service Request Management</h2>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Image</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.map((serviceRequest) => (
              <tr key={serviceRequest.request_id}>
                <td>{serviceRequest.request_id}</td>
                <td>{serviceRequest.title}</td>
                <td>{serviceRequest.description}</td>
                <td>{serviceRequest.status}</td>
                <td>{new Date(serviceRequest.created_at).toLocaleString()}</td>
                <td>
                  {serviceRequest.image && (
                    <img
                      src={`http://127.0.0.1:8000${serviceRequest.image}`}
                      alt="Request Image"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td>
                  <select
                    value={statusUpdates[serviceRequest.request_id] || serviceRequest.status}
                    onChange={(e) => handleStatusChange(serviceRequest.request_id, e.target.value)}
                  >
                    <option value="Created">Created</option>
                    <option value="Inprogress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button onClick={() => handleStatusUpdate(serviceRequest.request_id)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ServiceRequestManagement;
  