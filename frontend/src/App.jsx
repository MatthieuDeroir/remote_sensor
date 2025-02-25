import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function App() {
  const [sensorData, setSensorData] = useState({});
  // sensorData shape:
  // {
  //   [sensor_id]: [
  //       { xLabel, luminosity, temperature, humidity, soil_temperature, soil_humidity, pressure, altitude },
  //       ...
  //   ],
  //   ...
  // }

  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to Node.js WS (port 3001)
    const ws = new WebSocket('ws://172.20.10.2:3000');
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      console.log('✅ Connected to WebSocket on ws://172.20.10.2:3000');
    });

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      /*
        e.g. msg = {
          sensor_id: "ARDUINO_A",
          timestamp: "HH:MM:SS:MMM",
          luminosity: 12.5,
          temperature: 23.6,
          humidity: 47.2,
          soil_temperature: 20.1,
          soil_humidity: 15.7,
          pressure: 1012.3,
          altitude: 99.8
        }
      */
      const sid = msg.sensor_id || 'UNKNOWN';
      const label = `[${sid}] ${msg.timestamp}`; // custom label for x-axis

      setSensorData(prev => {
        const newData = { ...prev };
        if (!newData[sid]) {
          newData[sid] = [];
        }
        // Build a data point with a nice xLabel
        const point = {
          xLabel: label,
          luminosity: msg.luminosity,
          temperature: msg.temperature,
          humidity: msg.humidity,
          soil_temperature: msg.soil_temperature,
          soil_humidity: msg.soil_humidity,
          pressure: msg.pressure,
          altitude: msg.altitude
        };
        // Add to array, keep last 50
        newData[sid] = [...newData[sid], point].slice(-50);
        return newData;
      });
    });

    ws.addEventListener('close', () => {
      console.log('❌ WebSocket closed');
    });

    return () => {
      ws.close();
    };
  }, []);

  // We'll define a helper to render the 7 charts for a single sensor
  const renderChartsForSensor = (sid, dataArray) => {
    return (
      <div key={sid} style={{ margin: '2rem 0', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
        <h2>Sensor: {sid}</h2>

        {/* LUMINOSITY */}
        <h3>Luminosity (lux)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="luminosity" stroke="#ffa500" name="Luminosity" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TEMPERATURE */}
        <h3>Temperature (°C)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ff0000" name="Temperature" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* HUMIDITY */}
        <h3>Humidity (%)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#0000ff" name="Humidity" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SOIL TEMPERATURE */}
        <h3>Soil Temperature (°C)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil_temperature" stroke="#008000" name="Soil Temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SOIL HUMIDITY */}
        <h3>Soil Humidity (%)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil_humidity" stroke="#800080" name="Soil Hum" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PRESSURE */}
        <h3>Pressure (hPa)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pressure" stroke="#008b8b" name="Pressure" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ALTITUDE */}
        <h3>Altitude (m)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="xLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="altitude" stroke="#a52a2a" name="Altitude" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h1 style={{ textAlign: 'center' }}>Real-Time LoRa Sensor Data</h1>
      <p style={{ textAlign: 'center' }}>
        A separate chart for each sensor_id and each data field
      </p>
      {Object.keys(sensorData).length === 0 && (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
          Waiting for data...
        </p>
      )}
      {Object.entries(sensorData).map(([sid, dataArray]) =>
        renderChartsForSensor(sid, dataArray)
      )}
    </div>
  );
}

export default App;

