/**
 * Price calculation logic for taxi tariffs
 * Handles time-based tariff selection and price computation
 */

import { getTariffs } from "./tariffs.js";

/**
 * Parse "HH:MM" string to minutes since midnight
 * @param {string} timeStr - Time in "HH:MM" format
 * @returns {number} Minutes since midnight
 */
export const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Check if a time (in minutes) falls within a range
 * Supports ranges that cross midnight (e.g., 15:00-09:00)
 * @param {number} minutes - Time in minutes since midnight
 * @param {string} from - Start time "HH:MM"
 * @param {string} to - End time "HH:MM"
 * @returns {boolean} True if time is in range
 */
export const isInRange = (minutes, from, to) => {
  const fromMinutes = parseTime(from);
  const toMinutes = parseTime(to);

  if (fromMinutes < toMinutes) {
    // Normal range (e.g., 09:00-15:00)
    return minutes >= fromMinutes && minutes < toMinutes;
  } else {
    // Range crossing midnight (e.g., 15:00-09:00)
    return minutes >= fromMinutes || minutes < toMinutes;
  }
};

/**
 * Check if a date is a weekend (Friday or Saturday for Kurir)
 * @param {Date} date - Date to check
 * @returns {boolean} True if Friday or Saturday
 */
export const isWeekend = (date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 5 || dayOfWeek === 6; // Friday = 5, Saturday = 6
};

/**
 * Check if a date/time qualifies as workday daytime for Kurir
 * @param {Date} date - Date/time to check
 * @param {string} from - Start time "HH:MM"
 * @param {string} to - End time "HH:MM"
 * @returns {boolean} True if workday daytime
 */
export const isWeekdayDay = (date, from, to) => {
  const dayOfWeek = date.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; // Monday-Thursday

  if (!isWeekday) {
    return false;
  }

  const minutes = date.getHours() * 60 + date.getMinutes();
  return isInRange(minutes, from, to);
};

/**
 * Select the appropriate tariff based on company, car type, and datetime
 * @param {string} companyId - Company identifier
 * @param {string} carType - "small" or "big"
 * @param {Date} datetime - Date/time of the ride
 * @returns {Object|null} The matching tariff rule
 */
export const selectTariff = (companyId, carType, datetime) => {
  const tariffs = getTariffs(companyId, carType);

  if (!tariffs || tariffs.length === 0) {
    return null;
  }

  // If only one tariff (type "all"), return it
  if (tariffs.length === 1 && tariffs[0].type === "all") {
    return tariffs[0];
  }

  const minutes = datetime.getHours() * 60 + datetime.getMinutes();

  // Handle Kurir special logic (weekday-day vs night-weekend)
  if (companyId === "kurir") {
    const weekdayTariff = tariffs.find((t) => t.type === "weekday-day");
    const nightWeekendTariff = tariffs.find((t) => t.type === "night-weekend");

    if (
      weekdayTariff &&
      isWeekdayDay(datetime, weekdayTariff.from, weekdayTariff.to)
    ) {
      return weekdayTariff;
    }

    return nightWeekendTariff;
  }

  // Handle day/night tariffs for other companies
  for (const tariff of tariffs) {
    if (tariff.type === "all") {
      return tariff;
    }

    if (
      tariff.from &&
      tariff.to &&
      isInRange(minutes, tariff.from, tariff.to)
    ) {
      return tariff;
    }
  }

  // Fallback to first tariff if no match
  return tariffs[0];
};

/**
 * Calculate the price for a taxi ride
 * @param {Object} params - Calculation parameters
 * @param {string} params.companyId - Company identifier
 * @param {string} params.carType - "small" or "big"
 * @param {Date} params.datetime - Date/time of the ride
 * @param {number} params.distanceKm - Distance in kilometers
 * @param {number} params.durationMinutes - Duration in minutes
 * @returns {Object} Calculation result with breakdown and total
 */
export const calculatePrice = ({
  companyId,
  carType,
  datetime,
  distanceKm,
  durationMinutes,
}) => {
  const tariff = selectTariff(companyId, carType, datetime);

  if (!tariff) {
    return {
      error: "No tariff found for the specified parameters",
      rule: null,
      breakdown: null,
      totalRounded: 0,
    };
  }

  // Convert duration to hours
  const hours = durationMinutes / 60;

  // Calculate each component
  const basePart = tariff.base;
  const hourPart = tariff.hour * hours;
  const kmPart = tariff.km * distanceKm;

  // Total and round to nearest SEK
  const total = basePart + hourPart + kmPart;
  const totalRounded = Math.round(total);

  return {
    rule: tariff,
    breakdown: {
      basePart: Math.round(basePart * 100) / 100,
      timePart: Math.round(hourPart * 100) / 100,
      distancePart: Math.round(kmPart * 100) / 100,
    },
    totalRounded,
  };
};
