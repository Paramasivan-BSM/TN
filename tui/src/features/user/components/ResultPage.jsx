import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ResultPage.css'; // Import the separated CSS

// Import the thunk from your slice file
// Adjust the path as needed based on your project structure
import { fetchWorkers } from '../services/locationSlice'; // Example path

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to change map view
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14);
        }
    }, [center, map]);
    return null;
}

export const ResultPage = ({ serviceType = "Electrician" }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Select data from the Redux store
    const { workers, loading, error, latitude, longitude } = useSelector((state) => state.location);

    const [selectedLocation, setSelectedLocation] = useState(null);

    // Initial Fetch (Optional: If not fetched by a parent component)
    useEffect(() => {
        if (latitude && longitude) {
            dispatch(fetchWorkers({
                serviceType,
                latitude,
                longitude
            }));
        }
    }, [dispatch, serviceType, latitude, longitude]);

    // Handle Card Click
    const handleCardClick = (lat, lon) => {
        setSelectedLocation([lat, lon]);
    };

    // Default center if location is not available (e.g., user denied permission or initial load)
    // Using a fallback location (e.g. Tenkasi coordinates from previous examples as fallback)
    const mapCenter = (latitude && longitude) ? [latitude, longitude] : [8.9603, 77.3152];

    if (loading) {
        return (
            <div className="result-page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>Loading available {serviceType}s...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="result-page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ color: 'red' }}>Error: {error}</h2>
            </div>
        );
    }

    return (
        <div className="result-page-container">
            {/* Sidebar List */}
            <div className="result-sidebar">
                <h2 className="result-header">Available {serviceType}s</h2>

                {workers && workers.length > 0 ? (
                    <div className="result-card-list">
                        {workers.map((worker) => {
                            // Ensure coordinates exist before rendering
                            if (!worker.location || !worker.location.coordinates) return null;

                            const [lon, lat] = worker.location.coordinates;
                            return (
                                <div
                                    key={worker._id.timestamp + worker.name}
                                    className="result-card"
                                    onClick={() => handleCardClick(lat, lon)}
                                >
                                    <h3 className="result-name">{worker.name}</h3>
                                    <p className="result-skill">Skill: {worker.skill}</p>

                                    <div className="result-badge-container">
                                        <span
                                            className={`result-badge ${worker.available ? 'available' : 'busy'}`}
                                            style={{
                                                backgroundColor: worker.available ? '#dcfce7' : '#fee2e2',
                                                color: worker.available ? '#166534' : '#991b1b',
                                                border: `1px solid ${worker.available ? '#bbf7d0' : '#fecaca'}`
                                            }}
                                        >
                                            {worker.available ? 'Available' : 'Busy'}
                                        </span>
                                    </div>

                                    <p className="result-info">Service Radius: {worker.serviceRadiusKm} km</p>
                                    <div className="result-coords">
                                        <span className="result-pin-icon">📍</span>
                                        {lat.toFixed(4)}, {lon.toFixed(4)}
                                    </div>
                                    <button
                                        className="view-profile-btn"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click (map center)
                                            navigate(`/userlayout/deatil/${worker.name}`, { state: { worker } });
                                        }}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No workers found in this area.</p>
                )}
            </div>

            {/* Map Container */}
            <div className="result-map-wrapper">
                <MapContainer
                    center={mapCenter}
                    zoom={12}
                    className="result-map"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapUpdater center={selectedLocation || mapCenter} />

                    {/* render user location marker if available */}
                    {latitude && longitude && (
                        <Marker position={[latitude, longitude]}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {workers && workers.map((worker, index) => {
                        if (!worker.location || !worker.location.coordinates) return null;
                        const [lon, lat] = worker.location.coordinates;
                        return (
                            <Marker key={index} position={[lat, lon]}>
                                <Popup>
                                    <div>
                                        <h3>{worker.name}</h3>
                                        <p>{worker.skill}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default ResultPage;
