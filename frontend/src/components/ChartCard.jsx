import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ChartCard = ({ data, dataKey, color, title, unit }) => {
    return (
        <div style={{ width: '100%', height: 300, marginBottom: '1rem' }}>
            <h3>{title} {unit && `(${unit})`}</h3>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="xLabel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={dataKey} stroke={color} name={title} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartCard;
