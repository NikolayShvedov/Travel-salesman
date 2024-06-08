import React, { useState } from 'react';
import Map from './components/Map';
import AddressInput from './components/AddressInput';
import AddressList from './components/AddressList';
import { solveTSP } from './utils/tsp';
import './App.css';
import axios from 'axios';

interface Address {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

const App: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [route, setRoute] = useState<number[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const handleAddressSelect = (address: Address) => {
    if (addresses.length < 10) {
      setAddresses([...addresses, address]);
    }
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const calculateRoute = async () => {
    if (addresses.length > 1) {
      // Преобразование адресов в матрицу расстояний
      const distances: number[][] = addresses.map(a =>
        addresses.map(b => {
          return calculateDistance(a.lat, a.lon, b.lat, b.lon);
        })
      );

      const optimalRoute = solveTSP(distances);
      setRoute(optimalRoute);

      // Получение координат маршрута
      const coordinates: [number, number][] = [];
      for (let i = 0; i < optimalRoute.length - 1; i++) {
        const segmentCoordinates = await fetchRoute(
          addresses[optimalRoute[i]],
          addresses[optimalRoute[i + 1]]
        );
        coordinates.push(...segmentCoordinates);
      }
      setRouteCoordinates(coordinates);

      // Рассчитать общий километраж и время
      let distance = 0;
      for (let i = 0; i < optimalRoute.length - 1; i++) {
        distance += distances[optimalRoute[i]][optimalRoute[i + 1]];
      }
      setTotalDistance(distance);
      setTotalTime(distance / 60); // Предположим среднюю скорость 60 км/ч
    }
  };

  const fetchRoute = async (start: Address, end: Address): Promise<[number, number][]> => {
    const apiKey = '<API_KEY>';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lon},${start.lat}&end=${end.lon},${end.lat}`;
    const response = await axios.get(url);
    return response.data.features[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <h1>Коммивояжёр</h1>
        <AddressInput onAddressSelect={handleAddressSelect} isDisabled={addresses.length >= 10} />
        <AddressList addresses={addresses} onRemove={handleRemoveAddress} />
        <p>Осталось адресов: {10 - addresses.length}</p>
        <button onClick={calculateRoute} disabled={addresses.length < 2}>Рассчитать маршрут</button>
        <div>
          <h2>Маршрут:</h2>
          {route.map(index => (
            <div key={index}>
              {index === 0 && <strong>(Начало/Конец) </strong>}
              {addresses[index].label}
            </div>
          ))}
        </div>
        <div>
          <h2>Общая информация:</h2>
          <p>Общий километраж: {totalDistance.toFixed(2)} км</p>
          <p>Общее время: {totalTime.toFixed(2)} часов</p>
        </div>
      </div>
      <div className="right-panel">
        <Map markers={addresses.map(a => ({ lat: Number(a.lat), lng: Number(a.lon), label: a.label }))} routeCoordinates={routeCoordinates} />
      </div>
    </div>
  );
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371; // Радиус Земли в километрах

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

export default App;
