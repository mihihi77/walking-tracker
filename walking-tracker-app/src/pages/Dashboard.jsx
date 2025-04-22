import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
  const [selectedPage, setSelectedPage] = useState('Home');

  const renderContent = () => {
    switch (selectedPage) {
      case 'Home':
        return <p>Welcome to Home!</p>;
      case 'Tracking':
        return <p>Tracking your steps...</p>;
      case 'Notifications':
        return <p>You have no new notifications.</p>;
      default:
        return <p>Select a page</p>;
    }
  };

  return (
    <div className="dashboard">
      <Navbar onSelectPage={setSelectedPage} />

      <main className="dashboard-content">
        <h3>{selectedPage}</h3>
        <div style={{ marginTop: '20px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
