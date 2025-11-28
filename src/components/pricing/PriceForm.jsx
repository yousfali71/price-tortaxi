import React, { useState } from "react";
import "./PriceForm.css";

/**
 * PriceForm - Form for entering ride details to calculate price
 * Collects car type, datetime, distance, and duration
 */
const PriceForm = ({ company, onCalculate }) => {
  // Get current datetime in the format required for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    carType: "small",
    datetime: getCurrentDateTime(),
    distanceKm: "",
    durationMinutes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    const distance = parseFloat(formData.distanceKm);
    const duration = parseFloat(formData.durationMinutes);

    if (isNaN(distance) || distance <= 0) {
      alert("Please enter a valid distance");
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a valid duration");
      return;
    }

    // Convert datetime string to Date object
    const datetime = new Date(formData.datetime);

    onCalculate({
      companyId: company.id,
      carType: formData.carType,
      datetime,
      distanceKm: distance,
      durationMinutes: duration,
    });
  };

  return (
    <form className="price-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="carType">Car Type</label>
        <select
          id="carType"
          name="carType"
          value={formData.carType}
          onChange={handleChange}
          className="form-control"
        >
          <option value="small">Small Car (up to 4 passengers)</option>
          <option value="big">Big Car (5+ passengers)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="datetime">Date & Time</label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="distanceKm">Distance (km)</label>
        <input
          type="number"
          id="distanceKm"
          name="distanceKm"
          value={formData.distanceKm}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., 10.5"
          min="0.1"
          step="0.1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="durationMinutes">Duration (minutes)</label>
        <input
          type="number"
          id="durationMinutes"
          name="durationMinutes"
          value={formData.durationMinutes}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., 20"
          min="1"
          step="1"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-calculate"
        style={{ backgroundColor: company.accentColor }}
      >
        Calculate Price
      </button>
    </form>
  );
};

export default PriceForm;
