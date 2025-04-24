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

  const deg2rad = (deg) => deg * (Math.PI / 180);
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateDistance = (coords) => {
    let d = 0;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      d += getDistanceFromLatLonInKm(prev.lat, prev.lng, curr.lat, curr.lng);
    }
    return d;
  };

  const startTracking = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        // Nếu user đồng ý truy cập định vị
        setRoute([]);
        setIsTracking(true);

        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const newPoint = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            setRoute((prevRoute) => {
              const updatedRoute = [...prevRoute, newPoint];
              const d = calculateDistance(updatedRoute);
              setDistance(d);
              setCalories(d * 60);

              // Bắt đầu đếm giờ sau khi có định vị đầu tiên
              if (prevRoute.length === 0) {
                const start = Date.now();
                setStartTime(start);
                intervalRef.current = setInterval(() => {
                  setDuration(Math.floor((Date.now() - start) / 1000));
                }, 1000);
              }

              return updatedRoute;
            });
          },
          (err) => {
            console.error("Lỗi định vị:", err);
            alert("Không thể lấy vị trí. Hãy kiểm tra quyền truy cập định vị.");
            setIsTracking(false);
          },
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );

        setWatchId(id);
      },
      (err) => {
        console.error("User từ chối quyền định vị:", err);
        alert("Bạn cần cho phép truy cập vị trí để bắt đầu tracking.");
      }
    );
  };

  const stopTracking = async () => {
    navigator.geolocation.clearWatch(watchId);
    clearInterval(intervalRef.current);
    setIsTracking(false);

    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "users", user.uid, "activities"), {
        route,
        distance,
        duration,
        calories,
        createdAt: serverTimestamp(),
      });
    }
  };

  return (
    <div>
      <h2>Run Tracker</h2>

      <MapContainer
        center={route[route.length - 1] || centerDefault}
        zoom={16}
        style={containerStyle}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {route.length > 0 && <Polyline positions={route} color="red" />}
        {route.length > 0 && <Marker position={route[route.length - 1]} />}
      </MapContainer>

      <div style={{ marginTop: "1rem" }}>
        {!isTracking && <button onClick={startTracking}>Start</button>}
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
