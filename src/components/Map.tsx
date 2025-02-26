'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'

interface MapProps {
  latitude: number
  longitude: number
  address: string
}

const Map = ({ latitude, longitude, address }: MapProps) => {
  const position: LatLngExpression = [Number(latitude), Number(longitude)]

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export { Map }
export type { MapProps }
