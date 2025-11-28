import React from "react";
import "./ResultCard.css";

/**
 * ResultCard - Displays the calculated price breakdown and total
 * Shows base fare, hourly charge, distance charge, and total price
 */
const ResultCard = ({ result, company }) => {
  if (!result || result.error) {
    return (
      <div className="result-card result-error">
        <p>{result?.error || "Unable to calculate price"}</p>
      </div>
    );
  }

  const { rule, breakdown, totalRounded } = result;

  return (
    <div className="result-card">
      <div className="result-header">
        <h3>Price Breakdown</h3>
        <p className="tariff-description">{rule.description}</p>
      </div>

      <div className="result-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">Base fare</span>
          <span className="breakdown-value">
            {breakdown.basePart.toFixed(2)} SEK
          </span>
        </div>

        <div className="breakdown-item">
          <span className="breakdown-label">Time charge</span>
          <span className="breakdown-value">
            {breakdown.hourPart.toFixed(2)} SEK
          </span>
        </div>

        <div className="breakdown-item">
          <span className="breakdown-label">Distance charge</span>
          <span className="breakdown-value">
            {breakdown.kmPart.toFixed(2)} SEK
          </span>
        </div>

        <div className="breakdown-divider"></div>

        <div className="breakdown-item breakdown-total">
          <span className="breakdown-label">Total Price</span>
          <span
            className="breakdown-value total-value"
            style={{ color: company.accentColor }}
          >
            {totalRounded} SEK
          </span>
        </div>
      </div>

      <div className="result-footer">
        <p className="result-note">
          * This is an estimated price based on the tariff: {rule.description}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;
