import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapModal.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapModal = ({ onSelect, onClose, title, initialCoords }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const start = initialCoords
      ? [initialCoords.lng, initialCoords.lat]
      : [11.9746, 57.7089]; // Gothenburg center

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: start,
      zoom: 13,
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // If initial coords provided, add marker
    if (initialCoords) {
      addMarker(start);
      reverseGeocode(initialCoords.lat, initialCoords.lng);
    }

    // Click to add/move marker
    map.on("click", (e) => {
      const coords = [e.lngLat.lng, e.lngLat.lat];
      addMarker(coords);
      map.flyTo({ center: coords, duration: 800 });
      reverseGeocode(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.remove();
    };
  }, [initialCoords]);

  const addMarker = ([lng, lat]) => {
    setMarkerCoords({ lng, lat });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = "📍";

    const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    markerRef.current = marker;
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&language=en`;
      const res = await fetch(url);
      const data = await res.json();
      const placeName = data.features[0]?.place_name || "Selected location";
      setAddress(placeName);
    } catch (err) {
      setAddress("Selected location");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("map-modal-backdrop")) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (markerCoords) {
      onSelect({
        lat: markerCoords.lat,
        lng: markerCoords.lng,
        label: address,
      });
      onClose();
    }
  };

  return (
    <div className="map-modal-backdrop" onClick={handleBackdropClick}>
      <div className="map-modal-container">
        <div className="map-modal-header">
          <h3 className="map-modal-title">{title}</h3>
          <button className="map-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div ref={mapContainer} className="map-modal-map" />

        {address && (
          <div className="map-modal-address">
            <span className="address-icon">📍</span>
            <span className="address-text">{address}</span>
          </div>
        )}

        <div className="map-modal-footer">
          <button className="btn-map-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-map-confirm"
            onClick={handleConfirm}
            disabled={!markerCoords}
          >
            Use This Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
