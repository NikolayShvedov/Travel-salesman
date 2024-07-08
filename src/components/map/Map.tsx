import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// URL вашей пользовательской иконки
import customIconUrl from '../../assets/custom-icon.png';

// Создание пользовательской иконки
const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [32, 32], // Размер иконки
  iconAnchor: [16, 32], // Положение иконки относительно её точки привязки
  popupAnchor: [0, -32], // Положение попапа относительно иконки
});

const Map: React.FC<{ markers: { lat: number, lng: number, label: string }[], routeCoordinates: [number, number][] }> = ({ markers, routeCoordinates }) => {
  return (
    <MapContainer center={[55.751244, 37.618423]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
      {routeCoordinates.length > 0 && (
        <Polyline positions={routeCoordinates} color="blue" />
      )}
    </MapContainer>
  );
};

export default Map;