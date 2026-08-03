const numberFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeReading(reading, locationName, sensorName, index) {
  const context = `${locationName} / ${sensorName}, lectura ${index + 1}`;

  assert(reading && typeof reading === "object", `La ${context} no tiene un formato válido.`);
  assert(
    typeof reading.timestamp === "string" && !Number.isNaN(Date.parse(reading.timestamp)),
    `La fecha de ${context} no es válida.`
  );
  assert(
    reading.value === null || isFiniteNumber(reading.value),
    `El valor de ${context} debe ser un número o null.`
  );

  return {
    timestamp: reading.timestamp,
    value: reading.value,
  };
}

function normalizeSensor(sensor, locationName, index) {
  assert(sensor && typeof sensor === "object", `El sensor ${index + 1} no es válido.`);

  const sensorName = typeof sensor.name === "string" ? sensor.name.trim() : "";
  const sensorId = sensor.id === undefined || sensor.id === null ? "" : String(sensor.id);

  assert(sensorId, `Un sensor de ${locationName} no tiene identificador.`);
  assert(sensorName, `El sensor ${sensorId} de ${locationName} no tiene nombre.`);
  assert(sensor.limits && typeof sensor.limits === "object", `${sensorName} no tiene límites.`);
  assert(isFiniteNumber(sensor.limits.min), `El límite mínimo de ${sensorName} no es válido.`);
  assert(isFiniteNumber(sensor.limits.max), `El límite máximo de ${sensorName} no es válido.`);
  assert(sensor.limits.min <= sensor.limits.max, `Los límites de ${sensorName} están invertidos.`);
  assert(Array.isArray(sensor.readings), `${sensorName} no tiene una lista de lecturas válida.`);

  const readings = sensor.readings
    .map((reading, readingIndex) =>
      normalizeReading(reading, locationName, sensorName, readingIndex)
    )
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

  const scenario =
    sensor.scenario && typeof sensor.scenario === "object"
      ? {
          code: typeof sensor.scenario.code === "string" ? sensor.scenario.code : "",
          label: typeof sensor.scenario.label === "string" ? sensor.scenario.label : "",
          description:
            typeof sensor.scenario.description === "string" ? sensor.scenario.description : "",
        }
      : {
          code: "",
          label: typeof sensor.scenario === "string" ? sensor.scenario : "",
          description: "",
        };

  return {
    ...sensor,
    id: sensorId,
    name: sensorName,
    scenario,
    limits: {
      min: sensor.limits.min,
      max: sensor.limits.max,
    },
    readings,
  };
}

function normalizeLocation(location, index) {
  assert(location && typeof location === "object", `La ubicación ${index + 1} no es válida.`);

  const locationName = typeof location.name === "string" ? location.name.trim() : "";
  const locationId = location.id === undefined || location.id === null ? "" : String(location.id);

  assert(locationId, `La ubicación ${index + 1} no tiene identificador.`);
  assert(locationName, `La ubicación ${locationId} no tiene nombre.`);
  assert(Array.isArray(location.sensors), `${locationName} no tiene una lista de sensores válida.`);

  return {
    ...location,
    id: locationId,
    name: locationName,
    sensors: location.sensors.map((sensor, sensorIndex) =>
      normalizeSensor(sensor, locationName, sensorIndex)
    ),
  };
}

export function normalizeHistoryDataset(payload) {
  assert(payload && typeof payload === "object", "El archivo histórico está vacío.");
  assert(Array.isArray(payload.locations), "El archivo no contiene una lista de ubicaciones.");

  const samplingIntervalMinutes = Number(payload.samplingIntervalMinutes);
  assert(
    Number.isFinite(samplingIntervalMinutes) && samplingIntervalMinutes > 0,
    "La frecuencia de muestreo no es válida."
  );

  return {
    ...payload,
    unit: typeof payload.unit === "string" && payload.unit.trim() ? payload.unit : "°C",
    timezone:
      typeof payload.timezone === "string" && payload.timezone.trim()
        ? payload.timezone
        : "America/Bogota",
    samplingIntervalMinutes,
    period: payload.period && typeof payload.period === "object" ? payload.period : {},
    locations: payload.locations.map(normalizeLocation),
  };
}

export function getMissingPeriods(readings, samplingIntervalMinutes) {
  const periods = [];
  let startIndex = null;

  readings.forEach((reading, index) => {
    if (reading.value === null && startIndex === null) {
      startIndex = index;
    }

    const closesGap = reading.value !== null && startIndex !== null;
    const closesAtEnd = index === readings.length - 1 && startIndex !== null;

    if (closesGap || closesAtEnd) {
      const endIndex = closesGap ? index - 1 : index;
      const sampleCount = endIndex - startIndex + 1;

      periods.push({
        start: readings[startIndex].timestamp,
        end: readings[endIndex].timestamp,
        sampleCount,
        durationMinutes: sampleCount * samplingIntervalMinutes,
        active: endIndex === readings.length - 1,
      });

      startIndex = null;
    }
  });

  return periods;
}

export function calculateSensorSummary(sensor, samplingIntervalMinutes) {
  const readings = sensor?.readings || [];
  const validReadings = readings.filter(({ value }) => isFiniteNumber(value));
  const missingCount = readings.length - validReadings.length;
  const outOfRangeCount = validReadings.filter(
    ({ value }) => value < sensor.limits.min || value > sensor.limits.max
  ).length;
  const values = validReadings.map(({ value }) => value);
  const latestReading = readings[readings.length - 1] || null;
  const latestValidReading = [...validReadings].pop() || null;
  const missingPeriods = getMissingPeriods(readings, samplingIntervalMinutes);
  const total = readings.length;

  return {
    total,
    receivedCount: validReadings.length,
    missingCount,
    outOfRangeCount,
    coverage: total ? (validReadings.length / total) * 100 : 0,
    average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
    minimum: values.length ? Math.min(...values) : null,
    maximum: values.length ? Math.max(...values) : null,
    latestReading,
    latestValidReading,
    isOffline: Boolean(latestReading && latestReading.value === null),
    missingPeriods,
    currentMissingPeriod: missingPeriods.find(({ active }) => active) || null,
    longestMissingPeriod: missingPeriods.reduce(
      (longest, period) =>
        !longest || period.durationMinutes > longest.durationMinutes ? period : longest,
      null
    ),
  };
}

export function formatTemperature(value, unit = "°C") {
  return isFiniteNumber(value) ? `${numberFormatter.format(value)} ${unit}` : "Sin datos";
}

export function formatPercentage(value) {
  return `${numberFormatter.format(value)} %`;
}

export function formatDateTime(timestamp, timezone = "America/Bogota") {
  if (!timestamp) return "No disponible";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  };

  try {
    return new Intl.DateTimeFormat("es-CO", options).format(new Date(timestamp));
  } catch (error) {
    return new Intl.DateTimeFormat("es-CO", { ...options, timeZone: undefined }).format(
      new Date(timestamp)
    );
  }
}

export function formatChartTick(timestamp, timezone = "America/Bogota") {
  const options = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  };

  try {
    return new Intl.DateTimeFormat("es-CO", options).format(new Date(timestamp));
  } catch (error) {
    return new Intl.DateTimeFormat("es-CO", { ...options, timeZone: undefined }).format(
      new Date(timestamp)
    );
  }
}

export function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "0 min";

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remainingMinutes = Math.round(minutes % 60);
  const parts = [];

  if (days) parts.push(`${days} ${days === 1 ? "día" : "días"}`);
  if (hours) parts.push(`${hours} h`);
  if (remainingMinutes || !parts.length) parts.push(`${remainingMinutes} min`);

  return parts.join(" ");
}
