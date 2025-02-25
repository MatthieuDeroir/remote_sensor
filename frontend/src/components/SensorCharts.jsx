import React from 'react';
import ChartCard from './ChartCard';

const SensorCharts = ({ dataArray }) => {
    // dataArray est un tableau d'objets:
    // { xLabel, luminosity, temperature, humidity, soil_temperature, soil_humidity, pressure, altitude }

    return (
        <div style={{ flex: 1, padding: '1rem' }}>
            <ChartCard
                data={dataArray}
                dataKey="luminosity"
                color="#ffa500"
                title="Luminosité"
                unit="lux"
            />
            <ChartCard
                data={dataArray}
                dataKey="temperature"
                color="#ff0000"
                title="Température"
                unit="°C"
            />
            <ChartCard
                data={dataArray}
                dataKey="humidity"
                color="#0000ff"
                title="Humidité"
                unit="%"
            />
            <ChartCard
                data={dataArray}
                dataKey="soil_temperature"
                color="#008000"
                title="Temp. Sol"
                unit="°C"
            />
            <ChartCard
                data={dataArray}
                dataKey="soil_humidity"
                color="#800080"
                title="Humidité Sol"
                unit="%"
            />
            <ChartCard
                data={dataArray}
                dataKey="pressure"
                color="#008b8b"
                title="Pression"
                unit="hPa"
            />
            <ChartCard
                data={dataArray}
                dataKey="altitude"
                color="#a52a2a"
                title="Altitude"
                unit="m"
            />
        </div>
    );
};

export default SensorCharts;
