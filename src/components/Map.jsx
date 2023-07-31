import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = () => {
    const mapContainerStyle = {
        width: '400px', // Ancho del mapa
        height: '300px', // Altura del mapa
    };

    const center = {
        lat: 40.7128, // Latitud del centro del mapa
        lng: -74.0060, // Longitud del centro del mapa
    };
    // AIzaSyCza8PJmvppMHmHJyfwuxVFWFbK4KiL3_k&libraries=placeses,visualization,drawing,geometry,places
    return (
        <LoadScript googleMapsApiKey="AIzaSyCza8PJmvppMHmHJyfwuxVFWFbK4KiL3_k">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10} // Nivel de zoom inicial
            >
                {/* Agrega marcadores u otros elementos en el mapa aquí */}
                <Marker position={{ lat: 40.7128, lng: -74.0060 }} />
            </GoogleMap>
        </LoadScript>
    );
};

export { Map};