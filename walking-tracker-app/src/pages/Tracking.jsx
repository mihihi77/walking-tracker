import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = {
  lat: 21.0285,
  lng: 105.8542,
};

const Tracking = () => {
  const [route, setRoute] = useState([]);
  const [watchId, setWatchId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [watchId]);

  const calculateDistance = (coords) => {
    let d = 0;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      d += getDistanceFromLatLonInKm(prev.lat, prev.lng, curr.lat, curr.lng);
    }
    return d;
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const startTracking = () => {
    setRoute([]);  // Reset the route
    setStartTime(Date.now());  // Set start time
    setIsTracking(true);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.floor((now - startTime) / 1000); // Calculate elapsed time in seconds
      setDuration(elapsedSec);
    }, 1000);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        console.log("POSITION:", pos);
        const newPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setRoute((prev) => [...prev, newPoint]);  // Update the route with new point
        const d = calculateDistance([...route, newPoint]);  // Recalculate the distance
        setDistance(d);  // Update distance
        setCalories(d * 60);  // Estimate calories (60 cal/km)
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
    setWatchId(id);  // Set watch ID to clear later
  };

  const stopTracking = async () => {
    navigator.geolocation.clearWatch(watchId);  // Stop tracking GPS
    clearInterval(intervalRef.current);  // Clear the interval for time
    setIsTracking(false);  // Stop tracking flag

    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "users", user.uid, "activities"), {
        route,        // Save the route
        distance,     // Save the distance
        duration,     // Save the duration
        calories,     // Save the calories burned
        createdAt: serverTimestamp(),
      });
    }
  };

  return (
    <div>
      <h2>Run Tracker</h2>
      {!isTracking && route.length === 0 && (
        <MapContainer center={centerDefault} zoom={16} style={containerStyle}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      )}

      {isTracking && (
        <MapContainer center={route[route.length - 1] || centerDefault} zoom={16} style={containerStyle}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {route.length > 0 && <Polyline positions={route} color="red" />}
          {route.length > 0 && <Marker position={route[route.length - 1]} />}
        </MapContainer>
      )}

      <div style={{ marginTop: "1rem" }}>
        {!isTracking && (
          <button onClick={startTracking}>Start</button>
        )}
        {isTracking && (
          <>
            <button onClick={stopTracking}>Stop</button>
            <div>Time: {duration}s</div>
            <div>Distance: {distance.toFixed(2)} km</div>
            <div>Pace: {(duration / 60 / distance || 0).toFixed(2)} min/km</div>
            <div>Calories: {calories.toFixed(0)} kcal</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tracking;
