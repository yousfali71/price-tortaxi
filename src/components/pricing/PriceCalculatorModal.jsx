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
import { TOR_TAXI_PHONE, TOR_TAXI_URL } from "../../constants/config.js";
import "./PriceCalculatorModal.css";

const translations = {
  EN: {
    pageTitle: "Taxi Price Calculator",
    brandingNote: `Powered by TorTaxi.se – For booking or questions call ${TOR_TAXI_PHONE}.`,
    companySubtitle: "Choose your company",
    carType: "Car type",
    carTypeNormal: "Normal (up to 4 passengers)",
    carTypeBig: "Big (more passengers)",
    useMyLocation: "Use my location",
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
    goToTorTaxi: "Go to TorTaxi.se to book",
    infoTitle:
      "Price Calculator – Full transparency for both driver and customer",
    infoIntro: "Our pricing system is based on three main components:",
    infoComponent1: "Fixed start fee (Base Fare)",
    infoComponent2: "Price per kilometer (Per-km Rate)",
    infoComponent3: "Hourly rate (Hourly Rate)",
    infoDescription:
      "This tool calculates the expected cost of the trip with high accuracy, so that both driver and customer can see the price in advance and ensure that it is fair and reasonable.",
    infoNote:
      "Please note that the displayed prices are estimates and may vary depending on traffic conditions, available routes and any extra stops.",
  },
  SV: {
    pageTitle: "Taxi Prisberäkning",
    brandingNote: `Drivs av TorTaxi.se – För bokning eller frågor ring ${TOR_TAXI_PHONE}.`,
    companySubtitle: "Välj ditt företag",
    carType: "Bilstyp",
    carTypeNormal: "Normal (upp till 4 passagerare)",
    carTypeBig: "Stor (fler passagerare)",
    useMyLocation: "Använd min plats",
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
    goToTorTaxi: "Gå till TorTaxi.se för att boka",
    infoTitle: "Prisberäknare – Full transparens för både förare och kund",
    infoIntro: "Vårt prissystem bygger på tre huvudkomponenter:",
    infoComponent1: "Fast startavgift (Base Fare)",
    infoComponent2: "Kilometerpris (Per-km Rate)",
    infoComponent3: "Timpris (Hourly Rate)",
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
  const [lang, setLang] = useState("SV"); // Default to Swedish
  const [activeCompanyId, setActiveCompanyId] = useState("tor");
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Location states
  const [pickupText, setPickupText] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffText, setDropoffText] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [loadingGPS, setLoadingGPS] = useState(false);

  // Map modal states
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapModalType, setMapModalType] = useState(null); // 'pickup' or 'dropoff'

  // Result modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [routeData, setRouteData] = useState(null);

  const [formData, setFormData] = useState({
    carType: "small",
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

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert(
        lang === "SV"
          ? "Geolokalisering stöds inte av din webbläsare"
          : "Geolocation is not supported by your browser"
      );
      return;
    }

    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPickupCoords({ lat, lng });

        // Try to get address from coordinates using Mapbox reverse geocoding
        try {
          const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=${
              lang === "SV" ? "sv" : "en"
            }`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            setPickupText(data.features[0].place_name);
          } else {
            setPickupText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setPickupText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setLoadingGPS(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoadingGPS(false);

        let errorMessage = "Unable to retrieve your location.";
        if (lang === "SV") {
          errorMessage = "Kunde inte hämta din plats.";
        }

        if (error.code === 1) {
          errorMessage +=
            lang === "SV"
              ? " Tillåt platstjänster i webbläsaren."
              : " Please enable location access.";
        }

        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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

      // Use current date/time in Sweden (local time assumed)
      const datetime = new Date();

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

  const handleGoToTorTaxi = () => {
    window.open(TOR_TAXI_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="calculator-modal">
      {/* Branding note */}
      <div className="branding-note">{t.brandingNote}</div>

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
          <LocationAutocomplete
            label={t.pickupLocation}
            value={pickupText}
            onChange={setPickupText}
            onSelect={(location) => {
              setPickupCoords({ lat: location.lat, lng: location.lng });
            }}
            onMapClick={() => openMapModal("pickup")}
            placeholder={t.pickupPlaceholder}
            onGpsClick={handleUseMyLocation}
            gpsButtonText={t.useMyLocation}
            gpsLoading={loadingGPS}
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

      {/* Result summary */}
      <ResultSummary
        result={result}
        translations={t}
        accentColor={activeCompany.accentColor}
      />

      {/* Go to TorTaxi button */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn-go-to-tortaxi"
          onClick={handleGoToTorTaxi}
        >
          {t.goToTorTaxi}
        </button>
      </div>

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
