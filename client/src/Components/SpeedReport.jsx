import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table } from "react-bootstrap";
import "./SpeedReport.css";
import "../App.css";

const SpeedReport = () => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    axios
      .get("http://localhost:5000/records/speed-violations", {
        withCredentials: true,
      })
      .then((response) => {
        setRecords(response.data.records);
        setError(null); // Clear any previous error
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
        setError(error.message);
      });
  };

  const clearRecords = () => {
    axios
      .delete("http://localhost:5000/records/clear", { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);
        setRecords([]);
        setError(null); // Clear any previous error
      })
      .catch((error) => {
        console.error("Error clearing records:", error);
        setError(error.message);
      });
  };

  return (
    <div className="container mt-4">
      <Card className="speed-report-card">
        <Card.Header className="card-header-custom">
          <h2>Speed Violation Records</h2>
        </Card.Header>
        <Card.Body>
          {message && <div className="alert alert-info">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {records.length > 0 ? (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Speed (km/hr)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                      <td>{record.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="button-container mt-3">
                <Button variant="danger" onClick={clearRecords}>
                  Clear Records
                </Button>
              </div>
            </>
          ) : (
            <div className="no-records-message">No records found.</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SpeedReport;
