import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { useParams } from 'react-router-dom'; // nếu dùng params để lấy uid
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // đảm bảo bạn đã cài đặt Firebase và export db

import 'leaflet/dist/leaflet.css';

const ActivityHistory = () => {
  const [route, setRoute] = useState([]);
  const { activityId } = useParams(); // giả sử bạn dùng activityId trong URL

  useEffect(() => {
    const fetchRouteData = async () => {
      const docRef = doc(db, 'users', 'your-uid', 'activities', activityId); // chỉnh lại uid và activityId
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const activityData = docSnap.data();
        setRoute(activityData.route); // Giả sử route lưu dưới dạng mảng tọa độ
      } else {
        console.log("No such document!");
      }
    };

    fetchRouteData();
  }, [activityId]);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={[21.03, 105.81]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route.length > 0 && (
          <Polyline positions={route} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default ActivityHistory;
