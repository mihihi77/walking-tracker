import { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const centerDefault = { lat: 21.0285, lng: 105.8542 };

const Tracking = () => {
  const [route, setRoute] = useState([]);
  const [watchId, setWatchId] = useState(null);
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [pastActivities, setPastActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchPastActivities();
  }, []);

  const fetchPastActivities = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const activitiesRef = collection(db, "users", user.uid, "activities");
        const q = query(activitiesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const activities = [];
        querySnapshot.forEach((doc) => {
          activities.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        });
        setPastActivities(activities);
      } catch (error) {
        console.error("Error fetching past activities:", error);
      }
    }
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
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
    setSelectedActivity(null);
    setRoute([]);
    setDuration(0);
    setDistance(0);
    setCalories(0);
    setIsTracking(true);
    setShowSummary(false);

    const startTime = Date.now();
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        if (mapRef.current) {
          mapRef.current.panTo(newPoint);
        }

        setRoute((prev) => {
          const updated = [...prev, newPoint];
          const d = calculateDistance(updated);
          setDistance(d);
          setCalories(d * 60);
          return updated;
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Không thể lấy vị trí. Hãy kiểm tra quyền truy cập vị trí.");
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
    setWatchId(id);

    intervalRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };

  const stopTracking = async () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setIsTracking(false);
    setShowSummary(true);

    const user = auth.currentUser;
    if (user && route.length > 0) {
      try {
        await addDoc(collection(db, "users", user.uid, "activities"), {
          route,
          distance,
          duration,
          calories,
          createdAt: serverTimestamp(),
        });
        await fetchPastActivities();
      } catch (error) {
        console.error("Error saving activity:", error);
      }
    }
  };

  const goBackToMap = () => {
    setShowSummary(false);
    setSelectedActivity(null);
    setRoute([]); // Reset route to ensure map starts fresh
    setDuration(0);
    setDistance(0);
    setCalories(0);
  };

  const viewActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setShowSummary(true);
    setDuration(activity.duration);
    setDistance(activity.distance);
    setCalories(activity.calories);
    setRoute(activity.route || []);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
  };

  const calculatePace = () => {
    if (distance > 0) {
      const paceInSeconds = duration / distance;
      const paceMinutes = Math.floor(paceInSeconds / 60);
      const paceSeconds = Math.floor(paceInSeconds % 60);
      return `${String(paceMinutes).padStart(2, "0")}:${String(paceSeconds).padStart(2, "0")}`;
    }
    return "00:00";
  };

  const StatsDisplay = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", textAlign: "center", width: "100%" }}>
      <div>
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "bold" }}>TIME</h4>
        <p style={{ fontSize: "1.5rem", margin: 0 }}>{formatTime(duration)}</p>
      </div>
      <div>
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "bold" }}>DISTANCE</h4>
        <p style={{ fontSize: "1.5rem", margin: 0 }}>{distance.toFixed(2)} km</p>
      </div>
      <div>
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "bold" }}>PACE</h4>
        <p style={{ fontSize: "1.5rem", margin: 0 }}>{calculatePace()} min/km</p>
      </div>
      <div>
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "bold" }}>CALORIES</h4>
        <p style={{ fontSize: "1.5rem", margin: 0 }}>{calories.toFixed(0)} kcal</p>
      </div>
    </div>
  );

  const sectionStyle = {
    background: "linear-gradient(to bottom, rgba(40,40,40,0.8), rgba(30,30,30,0.8))",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    marginBottom: "1.5rem"
  };

  const sectionTitleStyle = {
    fontSize: "2rem", 
    fontWeight: "700", 
    marginBottom: "1.5rem",
    color: "#1db954",
    borderBottom: "2px solid #1db954",
    paddingBottom: "0.5rem"
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", color: "#fff", backgroundColor: "#000", minHeight: "100vh" }}>
      {/* Always render LoadScript and GoogleMap, but control visibility */}
      <LoadScript googleMapsApiKey="AIzaSyBuxYjqZruYYfcKa2crcOK-HGqXXY_cw18" onLoad={() => setMapLoaded(true)}>
        <div style={{ display: (isTracking || !showSummary) ? "block" : "none", marginBottom: "1.5rem" }}>
          {mapLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={route.length > 0 ? route[route.length - 1] : centerDefault}
              zoom={16}
              onLoad={(map) => {
                mapRef.current = map;
              }}
            >
              {route.length > 0 && <Marker position={route[route.length - 1]} />}
              {route.length > 1 && <Polyline path={route} options={{ strokeColor: "red" }} />}
            </GoogleMap>
          )}
        </div>
      </LoadScript>

      {isTracking ? (
        <div style={sectionStyle}>
          <StatsDisplay />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
            <button
              onClick={stopTracking}
              style={{
                backgroundColor: "red",
                color: "#fff",
                fontSize: "1.2rem",
                padding: "0.8rem 2rem",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(255,0,0,0.3)",
              }}
            >
              Stop
            </button>
          </div>
        </div>
      ) : showSummary ? (
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>{selectedActivity ? "ACTIVITY DETAILS" : "RUN SUMMARY"}</h2>
          {selectedActivity && <p style={{ marginBottom: "1rem" }}>Date: {formatDate(selectedActivity.createdAt)}</p>}
          <StatsDisplay />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
            <button
              onClick={goBackToMap}
              style={{
                backgroundColor: "#1db954",
                color: "#fff",
                fontSize: "1.2rem",
                padding: "0.8rem 2rem",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(29,185,84,0.3)",
              }}
            >
              Back to Map
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "1.5rem", flexDirection: "column" }}>
          {/* Run Tracker Section */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>RUN TRACKER</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={startTracking}
              style={{
                backgroundColor: "#1db954",
                color: "#fff",
                fontSize: "1.4rem",
                fontWeight: "bold",
                border: "none",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#24db63"; // Brighter green on hover
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#1db954"; // Back to original color
              }}
            >
              START
            </button>
            </div>
          </div>
          
          {/* Past Activities Section */}
          {pastActivities.length > 0 && (
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>PAST ACTIVITIES</h2>
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "0.8rem",
                maxHeight: "350px",
                overflowY: "auto",
                padding: "0.5rem"
              }}>
                {pastActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    onClick={() => viewActivityDetails(activity)}
                    style={{ 
                      backgroundColor: "#333", 
                      padding: "1rem 1.5rem", 
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#444";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#333";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ fontSize: "1.1rem" }}>{formatDate(activity.createdAt)}</div>
                    <div style={{ 
                      fontSize: "1.2rem", 
                      fontWeight: "bold", 
                      color: "#1db954" 
                    }}>
                      {activity.distance.toFixed(2)} km
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tracking;