import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();  // Initialize navigate here

  useEffect(() => {
    // Check if notifications already exist in localStorage, if not, create some sample notifications
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (stored.length === 0) {
      const sampleNotifications = [
        {
          title: 'New Activity Started',
          body: 'You have started a new running activity. Keep it up!',
          time: new Date().toLocaleTimeString(),
          page: 'Tracking',
        },
        {
          title: 'Activity Completed!',
          body: 'Great job! You completed your running activity. Check out your stats.',
          time: new Date().toLocaleTimeString(),
          page: 'Dashboard',
        },
        {
          title: 'Reminder: Time to Move',
          body: 'It’s been a while. Time to start a new activity and move your body!',
          time: new Date().toLocaleTimeString(),
          page: 'Tracking',
        },
      ];
      // Save the sample notifications to localStorage
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
      setNotifications(sampleNotifications);  // Set the notifications state
    } else {
      setNotifications(stored);
    }
  }, []);

  const handleNavigation = (page) => {
    // Navigate to the appropriate page when notification is clicked
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff' }}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={{ borderBottom: '1px solid #444', padding: '0.5rem 0' }}>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
            <small>{n.time}</small>
            <button
              onClick={() => handleNavigation(n.page)} // Ensure correct navigation
              style={{
                padding: '0.5rem',
                backgroundColor: '#1db954',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                marginTop: '0.5rem',
              }}
            >
              Go to {n.page}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;