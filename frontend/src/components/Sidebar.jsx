import React from 'react';
import './Sidebar.css';

const Sidebar = ({ sensorIds, activeSensor, onSelectSensor }) => {
    return (
        <div className="sidebar-container">
            <h2>Capteurs</h2>
            {sensorIds.length === 0 && (
                <p style={{ fontStyle: 'italic' }}>Aucun capteur</p>
            )}
            {sensorIds.map(sid => (
                <div
                    key={sid}
                    className={`sensor-item ${sid === activeSensor ? 'active' : ''}`}
                    onClick={() => onSelectSensor(sid)}
                >
                    {sid}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
