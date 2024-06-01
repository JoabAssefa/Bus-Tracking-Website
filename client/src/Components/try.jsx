import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import SpeedReport from "./SpeedReport";
import "../App.css";

const GpsTracking = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dateNow, setDateNow] = useState("");
  const [timeNow, setTimeNow] = useState("");
  const [speed, setSpeed] = useState("");
  const [polyline, setPolyline] = useState(null);
  const [statBtn, setStatBtn] = useState(0);
  const mapRef = useRef(null);
  const initialMarkerRef = useRef(null);
  const updatedMarkerRef = useRef(null);
  const finishMarkerRef = useRef(null);

  useEffect(() => {
    const map = L.map("map").setView([0, 0], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    const polyline = L.polyline([], { color: "blue" }).addTo(map);
    setPolyline(polyline);

    initialMarkerRef.current = L.marker([0, 0], {
      icon: createIcon("red"),
    }).addTo(map);
    updatedMarkerRef.current = L.marker([0, 0], {
      icon: createIcon("blue"),
    }).addTo(map);
    finishMarkerRef.current = L.marker([0, 0], {
      icon: createIcon("green"),
    }).addTo(map);

    const fetchDataInterval = setInterval(fetchData, 5000);
    fetchData();

    return () => {
      clearInterval(fetchDataInterval);
      map.remove();
    };
  }, []);

  const createIcon = (color) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const fetchData = () => {
    fetch(
      "https://api.thingspeak.com/channels/2545299/feeds/last.json?timezone=Asia%2FJakarta&api_key=C9Q9Y9SR9WCTGQFH"
    )
      .then((response) => response.json())
      .then((data) => updateMap(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const updateMap = (data) => {
    const latitude = parseFloat(data.field1);
    const longitude = parseFloat(data.field2);
    const speed = parseFloat(data.field3).toFixed(2);
    const timestamp = data.created_at;

    const [datePart, timePart] = timestamp.split("T");
    const dateNow = datePart;
    const timeNow = timePart.split("+")[0];

    setLatitude(latitude.toFixed(6));
    setLongitude(longitude.toFixed(6));
    setDateNow(dateNow);
    setTimeNow(timeNow);
    setSpeed(speed);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid LatLng object: ", [latitude, longitude]);
      return;
    }

    updateMarker(speed, latitude, longitude, dateNow, timeNow);

    if (statBtn === 1) {
      polyline.addLatLng([latitude, longitude]);
    }

    mapRef.current.panTo([latitude, longitude]);

    // Check for speed violation and record it
    if (speed > 80) {
      // Assuming 80 km/hr is the threshold
      axios
        .post("http://localhost:5000/records/record-speed", {
          speed,
          date: dateNow,
          time: timeNow,
        })
        .then((response) => {
          if (response.data.status) {
            console.log("Speed violation recorded:", response.data.message);
          } else {
            console.log("Speed within limits:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error recording speed violation:", error);
        });
    }
  };

  const updateMarker = (speed, latitude, longitude, dateNow, timeNow) => {
    const customPopup = `<b>Stored Data<br>${dateNow} ${timeNow}</b><br><b>Speed: </b>${speed} km/hr`;

    let marker;

    if (statBtn === 0) {
      marker = initialMarkerRef.current;
    } else if (statBtn === 1) {
      marker = updatedMarkerRef.current;
    } else if (statBtn === 2) {
      marker = finishMarkerRef.current;
    }

    marker.setLatLng([latitude, longitude]).bindPopup(customPopup).update();
  };

  const startPolyline = () => {
    if (statBtn === 0) {
      setStatBtn(1);
    } else if (statBtn === 1) {
      setStatBtn(2);
    }
  };

  const resetMap = () => {
    setStatBtn(0);
    setLatitude("");
    setLongitude("");
    setDateNow("");
    setTimeNow("");
    setSpeed("");

    polyline.setLatLngs([]);

    initialMarkerRef.current.setLatLng([0, 0]).bindPopup("").update();
    updatedMarkerRef.current.setLatLng([0, 0]).bindPopup("").update();
    finishMarkerRef.current.setLatLng([0, 0]).bindPopup("").update();

    fetchData();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            GPS Tracking
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={<FaEllipsisV size={20} />}
                  align="end"
                >
                  <Dropdown.Item as={Link} to="/bus">
                    Bus
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/records">
                    Records
                  </Dropdown.Item>
                  {/* Add more items as needed */}
                </DropdownButton>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container-fluid mt-4 d-flex">
        <div id="map" style={{ height: "500px", width: "70%" }}></div>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Last Data Received</h4>
          </div>
          <div className="card-body">
            <p>
              <strong>Latitude:</strong> {latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {longitude}
            </p>
            <p>
              <strong>Date:</strong> {dateNow}
            </p>
            <p>
              <strong>Time:</strong> {timeNow}
            </p>
            <p>
              <strong>Speed:</strong> {speed} km/hr
            </p>
            <button className="btn btn-primary me-2" onClick={startPolyline}>
              Start/Update
            </button>
            <button className="btn btn-secondary" onClick={resetMap}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/records" element={<SpeedReport />} />
      </Routes>
    </div>
  );
};

export default GpsTracking;
