/**
 * Tariff pricing rules for all taxi companies in the Tor Taxi Group
 * All prices are in SEK (Swedish Krona)
 *
 * Tariff structure:
 * - type: "day" | "night" | "all" | "weekday-day" | "night-weekend"
 * - from/to: "HH:MM" time strings (optional for "all" type)
 * - base: fixed start price
 * - hour: price per hour
 * - km: price per kilometer
 */

export const tariffs = {
  vib: {
    small: [
      {
        type: "day",
        from: "09:00",
        to: "15:00",
        base: 61,
        hour: 590,
        km: 16.82,
        description: "Day tariff (09:00–15:00)",
      },
      {
        type: "night",
        from: "15:00",
        to: "09:00",
        base: 61,
        hour: 597.67,
        km: 19.66,
        description: "Night tariff (15:00–09:00)",
      },
    ],
    big: [
      {
        type: "day",
        from: "09:00",
        to: "15:00",
        base: 89,
        hour: 885,
        km: 25.23,
        description: "Day tariff (09:00–15:00)",
      },
      {
        type: "night",
        from: "15:00",
        to: "09:00",
        base: 84,
        hour: 895,
        km: 29.49,
        description: "Night tariff (15:00–09:00)",
      },
    ],
  },

  tor: {
    small: [
      {
        type: "day",
        from: "07:00",
        to: "15:00",
        base: 39,
        hour: 720,
        km: 18,
        description: "Day tariff (07:00–15:00)",
      },
      {
        type: "night",
        from: "15:00",
        to: "07:00",
        base: 75,
        hour: 1136,
        km: 14,
        description: "Night tariff (15:00–07:00)",
      },
    ],
    big: [
      {
        type: "all",
        base: 95,
        hour: 1600,
        km: 32,
        description: "24h tariff",
      },
    ],
  },

  gtt: {
    small: [
      {
        type: "all",
        base: 75,
        hour: 760,
        km: 20,
        description: "24h tariff",
      },
    ],
    big: [
      {
        type: "all",
        base: 97,
        hour: 1400,
        km: 34.3,
        description: "24h tariff",
      },
    ],
  },

  kurir: {
    small: [
      {
        type: "weekday-day",
        from: "09:00",
        to: "15:00",
        base: 54,
        hour: 590,
        km: 19.7,
        description: "Workday tariff (09:00–15:00)",
      },
      {
        type: "night-weekend",
        from: "15:00",
        to: "09:00",
        base: 54,
        hour: 655,
        km: 20.65,
        description: "Night & weekend tariff (15:00–09:00 + Fri + Sat)",
      },
    ],
    big: [
      {
        type: "weekday-day",
        from: "09:00",
        to: "15:00",
        base: 82,
        hour: 885,
        km: 27.2,
        description: "Workday tariff (09:00–15:00)",
      },
      {
        type: "night-weekend",
        from: "15:00",
        to: "09:00",
        base: 82,
        hour: 1085,
        km: 27.2,
        description: "Night & weekend tariff (15:00–09:00 + Fri + Sat)",
      },
    ],
  },

  click: {
    small: [
      {
        type: "day",
        from: "07:00",
        to: "15:00",
        base: 75,
        hour: 836,
        km: 18,
        description: "Day tariff (07:00–15:00)",
      },
      {
        type: "night",
        from: "15:00",
        to: "07:00",
        base: 75,
        hour: 1136,
        km: 14,
        description: "Night tariff (15:00–07:00)",
      },
    ],
  },
};

export const getTariffs = (companyId, carType) => {
  return tariffs[companyId]?.[carType] || [];
};
