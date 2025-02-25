import React, { createContext, useState, useEffect, useRef } from 'react';

// On crée un contexte qui contiendra { sensorData, setSensorData }
export const SensorDataContext = createContext({});

export const SensorDataProvider = ({ children }) => {
    const [sensorData, setSensorData] = useState({});
    // shape : {
    //   [sensor_id]: [
    //      { luminosity, temperature, ... , xLabel }, ...
    //   ],
    //   ...
    // }

    // WebSocket ref
    const wsRef = useRef(null);

    useEffect(() => {
        // Connexion au Node WebSocket server (port 3001)
        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.addEventListener('open', () => {
            console.log('✅ Connected to WS on :3001');
        });

        ws.addEventListener('message', evt => {
            const msg = JSON.parse(evt.data);
            // msg = { sensor_id, timestamp, luminosity, temperature, humidity, soil_temperature, ... }

            const sid = msg.sensor_id || 'UNKNOWN';
            // On fabrique un label xLabel => (ex: "14:16:14" ou juste un compteur)
            const label = `[${sid}] ${msg.timestamp}`;

            setSensorData(prev => {
                const newData = { ...prev };
                if (!newData[sid]) newData[sid] = [];
                // On ajoute un nouveau point
                const newPoint = {
                    xLabel: label,
                    ...msg
                };
                // Garder max 50 points pour éviter inflation
                newData[sid] = [...newData[sid], newPoint].slice(-50);
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

    return (
        <SensorDataContext.Provider value={{ sensorData }}>
            {children}
        </SensorDataContext.Provider>
    );
};
