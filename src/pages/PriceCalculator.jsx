import React from "react";
import PriceCalculatorModal from "../components/pricing/PriceCalculatorModal.jsx";
import "./PriceCalculator.css";

/**
 * PriceCalculator - Price calculator page
 */
const PriceCalculator = () => {
  return (
    <div className="price-calculator-page">
      <PriceCalculatorModal />
    </div>
  );
};

export default PriceCalculator;
