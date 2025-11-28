import React, { useState, useEffect, useRef } from "react";
import "./LocationAutocomplete.css";

const LocationAutocomplete = ({
  value,
  onChange,
  onSelect,
  onMapClick,
  placeholder = "Search location...",
  label,
}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingValue, setTypingValue] = useState("");
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (typingValue.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            typingValue
          )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&proximity=11.9746,57.7089&language=en`
        );
        const data = await res.json();

        const suggestions = data.features.map((item) => ({
          label: item.place_name,
          lat: item.center[1],
          lng: item.center[0],
        }));

        setResults(suggestions);
      } catch (err) {
        console.warn("Mapbox fetch failed:", err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [typingValue, MAPBOX_TOKEN]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setTypingValue(inputValue.trim());
    if (!inputValue.trim()) {
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <div className="location-autocomplete-wrapper" ref={wrapperRef}>
      {label && <label className="location-label">{label}</label>}
      <div className="location-input-container">
        <input
          type="text"
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          className="form-control-modal"
          autoComplete="off"
          style={{ paddingRight: onMapClick ? "90px" : "40px" }}
        />
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        {onMapClick && !loading && (
          <button
            type="button"
            className="map-button"
            onClick={onMapClick}
            title="Select on map"
          >
            🗺️
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="location-results">
          {results.map((res, i) => (
            <li
              key={i}
              className="location-result-item"
              onClick={() => {
                onChange(res.label);
                onSelect({ lat: res.lat, lng: res.lng, label: res.label });
                setResults([]);
              }}
            >
              <i className="location-icon">📍</i>
              <span>{res.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
