import React, { useState } from "react";
import LangToggle from "./LangToggle.jsx";
import CompanyTabs from "./CompanyTabs.jsx";
import ResultSummary from "./ResultSummary.jsx";
import LocationAutocomplete from "./LocationAutocomplete.jsx";
import MapModal from "./MapModal.jsx";
import PriceResultModal from "./PriceResultModal.jsx";
import CustomSelect from "./CustomSelect.jsx";
import { companies } from "../../features/pricing/companiesConfig.js";
import { calculatePrice } from "../../features/pricing/calculatePrice.js";
import { getRouteDetails } from "../../utils/mapboxHelpers.js";
import "./PriceCalculatorModal.css";

const translations = {
  EN: {
    pageTitle: "Taxi Price Calculator",
    companySubtitle: "Choose your company",
    headline: "Know the price of your trip",
    carType: "Car type",
    carTypeNormal: "Normal (up to 4 passengers)",
    carTypeBig: "Big (more passengers)",
    dateTime: "Date & time",
    pickupLocation: "Pickup Location",
    dropoffLocation: "Dropoff Location",
    pickupPlaceholder: "Enter pickup address...",
    dropoffPlaceholder: "Enter dropoff address...",
    distance: "Distance (km)",
    duration: "Duration (minutes)",
    calculate: "Calculate price",
    calculating: "Calculating route...",
    routeError: "Could not calculate route. Please check locations.",
    summaryTitle: "Price summary",
    tariff: "Tariff",
    base: "Base",
    time: "Time",
    distanceLabel: "Distance",
    total: "Total",
    disclaimer: "This is an estimated price. Final fare may vary.",
    infoTitle:
      "Price Calculator – Full transparency for both driver and customer",
    infoIntro: "Our pricing system is based on three main components:",
    infoComponent1: "1. Fixed start fee (Base Fare)",
    infoComponent2: "2. Price per kilometer (Per-km Rate)",
    infoComponent3: "3. Hourly rate (Hourly Rate)",
    infoDescription:
      "This tool calculates the expected cost of the trip with high accuracy, so that both driver and customer can see the price in advance and ensure that it is fair and reasonable.",
    infoNote:
      "Please note that the displayed prices are estimates and may vary depending on traffic conditions, available routes and any extra stops.",
  },
  SV: {
    pageTitle: "Taxi Prisberäkning",
    companySubtitle: "Välj ditt företag",
    headline: "Kolla priset på din resa",
    carType: "Bilstyp",
    carTypeNormal: "Normal (upp till 4 passagerare)",
    carTypeBig: "Stor (fler passagerare)",
    dateTime: "Datum och tid",
    pickupLocation: "Upphämtningsplats",
    dropoffLocation: "Avlämningsplats",
    pickupPlaceholder: "Ange upphämtningsadress...",
    dropoffPlaceholder: "Ange avlämningsadress...",
    distance: "Sträcka (km)",
    duration: "Tid (minuter)",
    calculate: "Beräkna pris",
    calculating: "Beräknar rutt...",
    routeError: "Kunde inte beräkna rutt. Kontrollera platserna.",
    summaryTitle: "Prissammanställning",
    tariff: "Taxa",
    base: "Grundpris",
    time: "Tid",
    distanceLabel: "Sträcka",
    total: "Totalt",
    disclaimer: "Detta är ett uppskattat pris. Slutgiltigt pris kan variera.",
    infoTitle: "Prisberäknare – Full transparens för både förare och kund",
    infoIntro: "Vårt prissystem bygger på tre huvudkomponenter:",
    infoComponent1: "1. Fast startavgift (Base Fare)",
    infoComponent2: "2. Kilometerpris (Per-km Rate)",
    infoComponent3: "3. Timpris (Hourly Rate)",
    infoDescription:
      "Detta verktyg beräknar den förväntade kostnaden för resan med hög noggrannhet, så att både förare och kund kan se priset i förväg och försäkra sig om att det är rättvist och rimligt.",
    infoNote:
      "Observera att de visade priserna är uppskattningar och kan variera beroende på trafikläge, tillgänglig väg och eventuella extra stopp.",
  },
};

/**
 * PriceCalculatorModal - Main calculator modal with tabs
 */
const PriceCalculatorModal = () => {
  const [lang, setLang] = useState("EN");
  const [activeCompanyId, setActiveCompanyId] = useState("tor");
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Location states
  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  // Map modal states
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapModalType, setMapModalType] = useState(null); // 'pickup' or 'dropoff'

  // Result modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [routeData, setRouteData] = useState(null);

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

  const activeCompany = companies[activeCompanyId];
  const t = translations[lang];

  const handleCompanyChange = (companyId) => {
    setActiveCompanyId(companyId);
    setResult(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate locations
    if (!pickupCoords || !dropoffCoords) {
      alert(t.routeError || "Please select both pickup and dropoff locations");
      return;
    }

    setCalculating(true);
    setResult(null);

    try {
      // Get route details from Mapbox
      const routeData = await getRouteDetails(pickupCoords, dropoffCoords);

      if (
        !routeData.success ||
        !routeData.distanceKm ||
        !routeData.durationMinutes
      ) {
        alert(t.routeError);
        setCalculating(false);
        return;
      }

      // Store route data for modal display
      setRouteData(routeData);

      // Update form data with calculated values
      const distance = routeData.distanceKm;
      const duration = routeData.durationMinutes;

      setFormData((prev) => ({
        ...prev,
        distanceKm: distance.toString(),
        durationMinutes: duration.toString(),
      }));

      const datetime = new Date(formData.datetime);

      const calculationResult = calculatePrice({
        companyId: activeCompanyId,
        carType: formData.carType,
        datetime,
        distanceKm: distance,
        durationMinutes: duration,
      });

      setResult(calculationResult);

      // Show result modal
      setShowResultModal(true);
    } catch (error) {
      console.error("Route calculation error:", error);
      alert(t.routeError);
    } finally {
      setCalculating(false);
    }
  };

  const handleMapSelect = (location) => {
    if (mapModalType === "pickup") {
      setPickupText(location.label);
      setPickupCoords({ lat: location.lat, lng: location.lng });
    } else if (mapModalType === "dropoff") {
      setDropoffText(location.label);
      setDropoffCoords({ lat: location.lat, lng: location.lng });
    }
    setShowMapModal(false);
    setMapModalType(null);
  };

  const openMapModal = (type) => {
    setMapModalType(type);
    setShowMapModal(true);
  };

  return (
    <div className="calculator-modal">
      {/* Top bar with title and language */}
      <div className="modal-top-bar">
        <h2 className="page-title">{t.pageTitle}</h2>
        <LangToggle lang={lang} onLangChange={setLang} />
      </div>

      {/* Company selection subtitle */}
      <div
        className="company-subtitle"
        style={{ borderTopColor: activeCompany.accentColor }}
      >
        {t.companySubtitle}
      </div>

      {/* Company tabs */}
      <CompanyTabs
        companies={companies}
        activeCompanyId={activeCompanyId}
        onCompanyChange={handleCompanyChange}
      />

      {/* Company logo */}
      <div className="company-logo-section">
        <div
          className="company-logo-wrapper"
          style={{ borderColor: activeCompany.accentColor }}
        >
          <img
            src={activeCompany.logoSrc}
            alt={`${activeCompany.displayName} logo`}
            className="company-logo-modal"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div
          className="company-name-display"
          style={{ color: activeCompany.accentColor }}
        >
          {activeCompany.displayName}
        </div>
      </div>

      {/* Form */}
      <form className="price-form-modal" onSubmit={handleSubmit}>
        <div className="form-group-modal">
          <CustomSelect
            id="carType"
            label={t.carType}
            value={formData.carType}
            onChange={handleChange}
            options={[
              { value: "small", label: t.carTypeNormal },
              { value: "big", label: t.carTypeBig },
            ]}
          />
        </div>

        <div className="form-group-modal">
          <label htmlFor="datetime">{t.dateTime}</label>
          <input
            type="datetime-local"
            id="datetime"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className="form-control-modal"
            required
          />
        </div>

        <div className="form-group-modal">
          <LocationAutocomplete
            label={t.pickupLocation}
            value={pickupText}
            onChange={setPickupText}
            onSelect={(location) => {
              setPickupCoords({ lat: location.lat, lng: location.lng });
            }}
            onMapClick={() => openMapModal("pickup")}
            placeholder={t.pickupPlaceholder}
          />
        </div>

        <div className="form-group-modal">
          <LocationAutocomplete
            label={t.dropoffLocation}
            value={dropoffText}
            onChange={setDropoffText}
            onSelect={(location) => {
              setDropoffCoords({ lat: location.lat, lng: location.lng });
            }}
            onMapClick={() => openMapModal("dropoff")}
            placeholder={t.dropoffPlaceholder}
          />
        </div>

        {formData.distanceKm && formData.durationMinutes && (
          <div className="route-info">
            <div className="route-info-item">
              <span className="route-label">{t.distance}:</span>
              <span className="route-value">{formData.distanceKm} km</span>
            </div>
            <div className="route-info-item">
              <span className="route-label">{t.duration}:</span>
              <span className="route-value">
                {formData.durationMinutes} min
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-calculate-modal"
          style={{
            backgroundColor: activeCompany.accentColor,
            color: activeCompany.id === "tor" ? "#000" : "#fff",
          }}
          disabled={calculating}
        >
          {calculating ? t.calculating : t.calculate}
        </button>
      </form>

      {/* Information section */}
      <div className="info-section">
        <h3 className="info-title">{t.infoTitle}</h3>
        <p className="info-intro">{t.infoIntro}</p>
        <ul className="info-list">
          <li>{t.infoComponent1}</li>
          <li>{t.infoComponent2}</li>
          <li>{t.infoComponent3}</li>
        </ul>
        <p className="info-description">{t.infoDescription}</p>
        <p className="info-note">{t.infoNote}</p>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <MapModal
          title={
            mapModalType === "pickup" ? t.pickupLocation : t.dropoffLocation
          }
          initialCoords={
            mapModalType === "pickup" ? pickupCoords : dropoffCoords
          }
          onSelect={handleMapSelect}
          onClose={() => {
            setShowMapModal(false);
            setMapModalType(null);
          }}
        />
      )}

      {/* Price Result Modal */}
      {showResultModal && result && (
        <PriceResultModal
          onClose={() => setShowResultModal(false)}
          result={result}
          routeData={routeData}
          pickupLocation={{ ...pickupCoords, label: pickupText }}
          dropoffLocation={{ ...dropoffCoords, label: dropoffText }}
          formData={formData}
          companyName={activeCompany.displayName}
          companyColor={activeCompany.accentColor}
          translations={lang}
        />
      )}
    </div>
  );
};

export default PriceCalculatorModal;
