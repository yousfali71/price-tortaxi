import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./PriceResultModal.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const PriceResultModal = ({
  onClose,
  result,
  routeData,
  pickupLocation,
  dropoffLocation,
  formData,
  companyName,
  companyColor,
  translations,
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!pickupLocation || !dropoffLocation) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [pickupLocation.lng, pickupLocation.lat],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Add pickup marker
      const pickupEl = document.createElement("div");
      pickupEl.className = "route-marker pickup-marker";
      pickupEl.innerHTML = "🟢";
      new mapboxgl.Marker({ element: pickupEl, anchor: "bottom" })
        .setLngLat([pickupLocation.lng, pickupLocation.lat])
        .addTo(map);

      // Add dropoff marker
      const dropoffEl = document.createElement("div");
      dropoffEl.className = "route-marker dropoff-marker";
      dropoffEl.innerHTML = "🔴";
      new mapboxgl.Marker({ element: dropoffEl, anchor: "bottom" })
        .setLngLat([dropoffLocation.lng, dropoffLocation.lat])
        .addTo(map);

      // Draw route if available
      if (routeData?.route) {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeData.route,
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": companyColor || "#ffc107",
            "line-width": 5,
            "line-opacity": 0.8,
          },
        });

        // Fit map to route bounds
        const bounds = new mapboxgl.LngLatBounds();
        routeData.route.coordinates.forEach((coord) => {
          bounds.extend(coord);
        });
        map.fitBounds(bounds, { padding: 60 });
      }
    });

    return () => {
      map.remove();
    };
  }, [pickupLocation, dropoffLocation, routeData, companyColor]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("price-result-backdrop")) {
      onClose();
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString(translations === "SV" ? "sv-SE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="price-result-backdrop" onClick={handleBackdropClick}>
      <div className="price-result-modal">
        <div
          className="price-result-header"
          style={{ borderTopColor: companyColor }}
        >
          <div className="header-content">
            <h2 className="result-modal-title">Trip Summary</h2>
            <div
              className="company-badge"
              style={{ backgroundColor: companyColor }}
            >
              {companyName}
            </div>
          </div>
          <button className="result-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="price-result-content">
          {/* Map Section */}
          <div className="result-map-section">
            <div ref={mapContainer} className="result-map" />
          </div>

          {/* Trip Details */}
          <div className="trip-details-section">
            <h3 className="section-title">Trip Details</h3>

            <div className="detail-group">
              <div className="detail-label">🟢 Pickup</div>
              <div className="detail-value">{pickupLocation.label}</div>
            </div>

            <div className="detail-group">
              <div className="detail-label">🔴 Dropoff</div>
              <div className="detail-value">{dropoffLocation.label}</div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <div className="detail-label">📅 Date & Time</div>
                <div className="detail-value">
                  {formatDateTime(formData.datetime)}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">🚗 Car Type</div>
                <div className="detail-value">
                  {formData.carType === "small"
                    ? "Normal (4 pass.)"
                    : "Big (more pass.)"}
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <div className="detail-label">📏 Distance</div>
                <div className="detail-value highlight">
                  {formData.distanceKm} km
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">⏱️ Duration</div>
                <div className="detail-value highlight">
                  {formData.durationMinutes} min
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="price-breakdown-section">
            <h3 className="section-title">Price Breakdown</h3>

            <div className="tariff-info">
              <span className="tariff-label">Tariff:</span>
              <span className="tariff-value">
                {result.rule.type === "all"
                  ? "24h tariff"
                  : `${result.rule.type} tariff ${result.rule.from || ""}–${
                      result.rule.to || ""
                    }`}
              </span>
            </div>

            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="breakdown-label">Base Fare</span>
                <span className="breakdown-value">
                  {result.breakdown.basePart.toFixed(2)} kr
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Time Charge</span>
                <span className="breakdown-value">
                  {result.breakdown.timePart.toFixed(2)} kr
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Distance Charge</span>
                <span className="breakdown-value">
                  {result.breakdown.distancePart.toFixed(2)} kr
                </span>
              </div>
            </div>

            <div
              className="total-price"
              style={{ borderTopColor: companyColor }}
            >
              <span className="total-label">Total Price</span>
              <span className="total-value" style={{ color: companyColor }}>
                {result.totalRounded} kr
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="result-actions">
            <button
              className="btn-result-primary"
              onClick={onClose}
              style={{ backgroundColor: companyColor }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceResultModal;
