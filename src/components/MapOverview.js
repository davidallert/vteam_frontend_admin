import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

//Redux Slice
import { useSelector, useDispatch } from 'react-redux';
import { fetchStations } from '../redux-slices/StationsSlice';
import { fetchScooters } from '../redux-slices/ScootersSlice';

// Icons
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { FaChargingStation } from "react-icons/fa";
import { TbParkingCircleFilled } from "react-icons/tb";
import { BsScooter } from "react-icons/bs";


//Leaflet requires a Leaflet Icon (or DivIcon) object,
//not a raw React element. React Icons only provides React components,
// so we must convert the TbParkingCircleFilled component to static HTML (via renderToStaticMarkup) and pass that HTML to a Leaflet DivIcon.
const chargingIcon = new L.DivIcon({
    className: 'custom-parking-icon',
    html: renderToStaticMarkup(<FaChargingStation style={{ color: "green", fontSize: "20px" }} />),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const parkingIcon = new L.DivIcon({
    className: 'custom-parking-charging-false-icon',
    html: renderToStaticMarkup(<TbParkingCircleFilled style={{ color: "black", fontSize: "20px" }} />),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

//Scooters active icon color
const activeScooterIcon = new L.DivIcon({
    className: 'custom-scooter-icon',
    html: renderToStaticMarkup(<BsScooter style={{ color: "green", fontSize: "20px" }} />),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

//Scooters inactive icon color
const inactiveScooterIcon = new L.DivIcon({
className: 'custom-scooter-icon',
html: renderToStaticMarkup(<BsScooter style={{ color: "red", fontSize: "20px" }} />),
iconSize: [24, 24],
iconAnchor: [12, 24],
});


// This is arrow function it works as same as the function functionName() that i used in the other components.
function MapOverview() {
    const dispatch = useDispatch();
    const { data: stations, status: stationsStatus } = useSelector((state) => state.stations);
    const { data: scooters, status: scootersStatus } = useSelector((state) => state.scooters);

    useEffect(() => {
        if (stationsStatus === 'idle') {
            dispatch(fetchStations());
        }
        if (scootersStatus === 'idle') {
            dispatch(fetchScooters());
        }
    }, [ stationsStatus, scootersStatus, dispatch ]);

        if (stationsStatus === 'loading' || scootersStatus === 'loading') {
            return <p>Loading data...</p>;
        }

        if (stationsStatus === 'failed' || scootersStatus === 'failed') {
            return <p>Failed to fetch data. Please try again.</p>;
        }

    // Defining initial center coordinates for the map in Stockholm, Sweden
    const initialCenter = [59.3293, 18.0686];

    return (
        <MapContainer center={initialCenter} zoom={10} style={{ height: "600px", width: "100%" }}>
        {/* TileLayer for the map base */}
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
        />

        {/* Rendering markers for stations */}
        {stations.map((station, index) => (
            <Marker 
                key={index} 
                position={[station.location.coordinates[1], station.location.coordinates[0]]}
                icon={station.charging_station ? chargingIcon : parkingIcon}
            >
            <Popup>
                Station ID: {station._id} <br/> 
                Station Name: {station.name} <br/> 
                Charging Station: {String(station.charging_station)} <br/> 
                Max Scooters capacity: {station.no_of_scooters_max} <br/> 
            </Popup>
            </Marker>
        ))}

        {scooters.map((scooter) => (
            <Marker
            key={scooter._id}
            position={[
                scooter.current_location.coordinates[1],
                scooter.current_location.coordinates[0],
            ]}
            icon={scooter.status === 'active' ? activeScooterIcon : inactiveScooterIcon}
            >
                <Popup>
                    Scooter ID: {scooter._id} <br />
                    Status: {scooter.status} <br />
                    Battery Level: {scooter.battery_level}%
                </Popup>
            </Marker>
        ))}
        </MapContainer>
    );
};

export default MapOverview;