import React, { useContext, useState } from 'react';
import { SensorDataContext } from '../context/SensorDataContext';
import Sidebar from '../components/Sidebar';
import SensorCharts from '../components/SensorCharts';
import './Dashboard.css';

const Dashboard = () => {
    const { sensorData } = useContext(SensorDataContext);
    const [activeSensor, setActiveSensor] = useState(null);

    const sensorIds = Object.keys(sensorData);

    let dataArray = [];
    if (activeSensor && sensorData[activeSensor]) {
        dataArray = sensorData[activeSensor];
    }

    return (
        <div className="dashboard-container">
            <Sidebar
                sensorIds={sensorIds}
                activeSensor={activeSensor}
                onSelectSensor={(sid) => setActiveSensor(sid)}
            />
            <div className="dashboard-main">
                {!activeSensor && (
                    <div style={{ padding: '1rem' }}>
                        <h2>Veuillez sélectionner un capteur dans la liste</h2>
                    </div>
                )}
                {activeSensor && dataArray.length > 0 && (
                    <SensorCharts dataArray={dataArray} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
