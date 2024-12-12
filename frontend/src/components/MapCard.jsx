import React from 'react';
import { Card, Table } from 'antd';
import { useNavigate } from 'react-router-dom';

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";


const MapCard = ({ position }) => {
  return (
    <Card title="Location" bordered={false} style={{ height: 400 }}>
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Meel
          </Popup>
        </Marker>
      </MapContainer>


    </Card>
  );
};

export default MapCard;


