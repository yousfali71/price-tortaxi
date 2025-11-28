import React from "react";

/**
 * ResultSummary - Displays price calculation breakdown
 */
const ResultSummary = ({ result, translations, accentColor }) => {
  if (!result) return null;

  const { rule, breakdown, totalRounded } = result;

  // Safety check for breakdown
  if (!breakdown || typeof breakdown !== "object") {
    return null;
  }

  // Build tariff description
  let tariffDesc = "";
  if (rule.type === "all") {
    tariffDesc = "24h tariff";
  } else if (rule.from && rule.to) {
    tariffDesc = `${rule.type} tariff ${rule.from}–${rule.to}`;
  }

  return (
    <div className="result-summary">
      <h3 className="summary-title">{translations.summaryTitle}</h3>

      <div className="summary-content">
        <div className="summary-row tariff-row">
          <span className="summary-label">{translations.tariff}:</span>
          <span className="summary-value">{tariffDesc}</span>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-row">
          <span className="summary-label">{translations.base}:</span>
          <span className="summary-value">
            {(breakdown.basePart || 0).toFixed(2)} kr
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">{translations.time}:</span>
          <span className="summary-value">
            {(breakdown.timePart || 0).toFixed(2)} kr
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">{translations.distanceLabel}:</span>
          <span className="summary-value">
            {(breakdown.distancePart || 0).toFixed(2)} kr
          </span>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-row summary-total">
          <span className="summary-label">{translations.total}:</span>
          <span
            className="summary-value total-value"
            style={{ color: accentColor }}
          >
            {totalRounded || 0} kr
          </span>
        </div>
      </div>

      <p className="summary-disclaimer">* {translations.disclaimer}</p>
    </div>
  );
};

export default ResultSummary;
