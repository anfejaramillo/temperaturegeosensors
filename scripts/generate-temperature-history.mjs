import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SCHEMA_VERSION = "1.0.0";
const TIMEZONE = "America/Bogota";
const UTC_OFFSET = "-05:00";
const UNIT = "°C";
const SAMPLING_INTERVAL_MINUTES = 1;
const PERIOD_HOURS = 48;
const PERIOD_END = "2026-08-02T18:00:00-05:00";
const SAMPLE_COUNT = (PERIOD_HOURS * 60) / SAMPLING_INTERVAL_MINUTES + 1;
const MINUTE_IN_MILLISECONDS = 60_000;

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(rootDirectory, "public", "data", "temperature-history.json");

const periodEndMilliseconds = Date.parse(PERIOD_END);
const periodStartMilliseconds = periodEndMilliseconds - PERIOD_HOURS * 60 * MINUTE_IN_MILLISECONDS;

const roundTemperature = (value) => Math.round(value * 10) / 10;

const formatBogotaTimestamp = (milliseconds) => {
  const bogotaMilliseconds = milliseconds - 5 * 60 * MINUTE_IN_MILLISECONDS;
  return `${new Date(bogotaMilliseconds).toISOString().slice(0, -1)}${UTC_OFFSET}`;
};

const timestampAt = (index) =>
  formatBogotaTimestamp(
    periodStartMilliseconds + index * SAMPLING_INTERVAL_MINUTES * MINUTE_IN_MILLISECONDS
  );

const wave = (index, amplitude, period, phase = 0) =>
  amplitude * Math.sin((2 * Math.PI * index) / period + phase);

const stable =
  ({ base, amplitude = 0.3, period = 180, phase = 0 }) =>
  (index) =>
    roundTemperature(base + wave(index, amplitude, period, phase));

const withUpperExcursion =
  ({ base, amplitude, period, max, start, riseEnd, plateauEnd, recoveryEnd }) =>
  (index) => {
    const normalValue = base + wave(index, amplitude, period);

    if (index < start || index > recoveryEnd) {
      return roundTemperature(normalValue);
    }

    if (index <= riseEnd) {
      const progress = (index - start) / (riseEnd - start);
      return roundTemperature(normalValue + progress * (max + 2.2 - normalValue));
    }

    if (index <= plateauEnd) {
      return roundTemperature(max + 1.6 + wave(index, 0.25, 37));
    }

    const progress = (index - plateauEnd) / (recoveryEnd - plateauEnd);
    return roundTemperature(max + 1.6 + (normalValue - (max + 1.6)) * progress);
  };

const withLowerExcursionAndRecovery =
  ({ base, amplitude, period, min, start, fallEnd, plateauEnd, recoveryEnd }) =>
  (index) => {
    const normalValue = base + wave(index, amplitude, period, Math.PI / 5);

    if (index < start || index > recoveryEnd) {
      return roundTemperature(normalValue);
    }

    if (index <= fallEnd) {
      const progress = (index - start) / (fallEnd - start);
      return roundTemperature(normalValue + progress * (min - 1.5 - normalValue));
    }

    if (index <= plateauEnd) {
      return roundTemperature(min - 1.1 + wave(index, 0.2, 31));
    }

    const progress = (index - plateauEnd) / (recoveryEnd - plateauEnd);
    return roundTemperature(min - 1.1 + (normalValue - (min - 1.1)) * progress);
  };

const withIntermittentSpikes =
  ({ base, min, max, spikeCenters }) =>
  (index) => {
    const normalValue = base + wave(index, 0.3, 140, Math.PI / 4);
    const activeSpike = spikeCenters.find((center) => Math.abs(index - center) <= 8);

    if (activeSpike === undefined) {
      return roundTemperature(Math.max(min, Math.min(max, normalValue)));
    }

    const distance = Math.abs(index - activeSpike);
    return roundTemperature(max + 0.4 + (8 - distance) * 0.16);
  };

const atExactLimits =
  ({ base, min, max }) =>
  (index) => {
    if (index >= 240 && index <= 360) return min;
    if (index >= 1_440 && index <= 1_560) return max;
    return roundTemperature(base + wave(index, 0.35, 210));
  };

const withCommunicationGap =
  ({ base, amplitude, period, gapStart, gapEnd }) =>
  (index) => {
    if (index >= gapStart && index <= gapEnd) return null;
    return roundTemperature(base + wave(index, amplitude, period, Math.PI / 7));
  };

const persistentUpperExcursion =
  ({ base, max, start }) =>
  (index) => {
    if (index < start) {
      return roundTemperature(base + wave(index, 0.35, 160));
    }

    const minutesSinceStart = index - start;
    const rise = Math.min(minutesSinceStart / 45, 1);
    return roundTemperature(base + rise * (max + 1.2 - base) + wave(index, 0.25, 95));
  };

const locations = [
  {
    id: "transporte-alimentos-la-vaca",
    name: "Transporte de Alimentos La Vaca",
    position: { lat: 4.806920919644718, lng: -75.72371442527306 },
    sensors: [
      {
        id: "camara-refrigerada",
        name: "Sensor de la cámara refrigerada",
        limits: { min: 2, max: 8 },
        scenario: {
          code: "stable",
          label: "Operación estable",
          description: "Lecturas dentro del rango permitido durante todo el periodo.",
        },
        valueAt: stable({ base: 4.4, amplitude: 0.45, period: 210 }),
      },
      {
        id: "congelador-carga",
        name: "Sensor del congelador de carga",
        limits: { min: -20, max: -18 },
        scenario: {
          code: "communication-gap-recovery",
          label: "Pérdida de comunicación y recuperación",
          description:
            "Ausencia consecutiva de datos durante 180 minutos, seguida por lecturas normales.",
        },
        outages: [
          {
            start: timestampAt(900),
            end: timestampAt(1_079),
            missingSamples: 180,
            durationMinutes: 180,
          },
        ],
        valueAt: withCommunicationGap({
          base: -19.1,
          amplitude: 0.35,
          period: 190,
          gapStart: 900,
          gapEnd: 1_079,
        }),
      },
      {
        id: "cabina-termica",
        name: "Sensor de la cabina térmica",
        limits: { min: 2, max: 8 },
        scenario: {
          code: "upper-excursion-recovery",
          label: "Excursión superior con recuperación",
          description: "Aumento sobre el límite máximo y retorno progresivo al rango permitido.",
        },
        valueAt: withUpperExcursion({
          base: 5.2,
          amplitude: 0.4,
          period: 175,
          max: 8,
          start: 1_200,
          riseEnd: 1_230,
          plateauEnd: 1_350,
          recoveryEnd: 1_410,
        }),
      },
    ],
  },
  {
    id: "restaurante-el-camello",
    name: "Restaurante El Camello",
    position: { lat: 4.79657185650471, lng: -75.70508916792271 },
    sensors: [
      {
        id: "refrigerador-cocina",
        name: "Sensor del refrigerador de cocina",
        limits: { min: 2, max: 8 },
        scenario: {
          code: "lower-excursion-recovery",
          label: "Excursión inferior con recuperación",
          description:
            "Descenso bajo el límite mínimo y recuperación gradual hasta el rango permitido.",
        },
        valueAt: withLowerExcursionAndRecovery({
          base: 5.1,
          amplitude: 0.35,
          period: 165,
          min: 2,
          start: 600,
          fallEnd: 630,
          plateauEnd: 720,
          recoveryEnd: 780,
        }),
      },
      {
        id: "congelador-principal",
        name: "Sensor del congelador principal",
        limits: { min: -22, max: -18 },
        scenario: {
          code: "stable-cyclic",
          label: "Ciclo estable de congelación",
          description: "Oscilación normal del compresor sin exceder los límites permitidos.",
        },
        valueAt: stable({
          base: -19.8,
          amplitude: 0.75,
          period: 130,
          phase: Math.PI / 3,
        }),
      },
      {
        id: "vitrina-fria",
        name: "Sensor de la vitrina fría",
        limits: { min: 2, max: 8 },
        scenario: {
          code: "persistent-upper-excursion",
          label: "Temperatura alta persistente",
          description: "Excursión superior sostenida durante la parte final del periodo.",
        },
        valueAt: persistentUpperExcursion({ base: 5.8, max: 8, start: 2_100 }),
      },
    ],
  },
  {
    id: "supermercado-el-duro",
    name: "Supermercado El Duro",
    position: { lat: 4.812736853098565, lng: -75.68277319137388 },
    sensors: [
      {
        id: "zona-lacteos",
        name: "Sensor de la zona de lácteos",
        limits: { min: 2, max: 6 },
        scenario: {
          code: "intermittent-spikes",
          label: "Picos intermitentes",
          description: "Picos breves sobre el límite superior distribuidos a lo largo del periodo.",
        },
        valueAt: withIntermittentSpikes({
          base: 4.1,
          min: 2,
          max: 6,
          spikeCenters: [320, 710, 1_105, 1_690, 2_220, 2_675],
        }),
      },
      {
        id: "vitrina-carnes",
        name: "Sensor de la vitrina de carnes",
        limits: { min: 0, max: 4 },
        scenario: {
          code: "exact-limits",
          label: "Lecturas en los límites exactos",
          description:
            "Periodos completos exactamente sobre los límites mínimo y máximo permitidos.",
        },
        valueAt: atExactLimits({ base: 2.2, min: 0, max: 4 }),
      },
      {
        id: "isla-congelados",
        name: "Sensor de la isla de congelados",
        limits: { min: -22, max: -18 },
        scenario: {
          code: "active-communication-gap",
          label: "Sensor sin comunicación",
          description:
            "Operación estable seguida por 60 minutos consecutivos sin recepción de datos.",
        },
        outages: [
          {
            start: timestampAt(SAMPLE_COUNT - 60),
            end: timestampAt(SAMPLE_COUNT - 1),
            missingSamples: 60,
            durationMinutes: 60,
          },
        ],
        valueAt: withCommunicationGap({
          base: -18.7,
          amplitude: 0.55,
          period: 155,
          gapStart: SAMPLE_COUNT - 60,
          gapEnd: SAMPLE_COUNT - 1,
        }),
      },
    ],
  },
];

const buildReadings = (valueAt) =>
  Array.from({ length: SAMPLE_COUNT }, (_, index) => ({
    timestamp: timestampAt(index),
    value: valueAt(index),
  }));

const dataset = {
  schemaVersion: SCHEMA_VERSION,
  generatedAt: PERIOD_END,
  timezone: TIMEZONE,
  unit: UNIT,
  samplingIntervalMinutes: SAMPLING_INTERVAL_MINUTES,
  period: {
    start: formatBogotaTimestamp(periodStartMilliseconds),
    end: formatBogotaTimestamp(periodEndMilliseconds),
    durationHours: PERIOD_HOURS,
    boundaries: "inclusive",
    expectedSamplesPerSensor: SAMPLE_COUNT,
  },
  locations: locations.map((location) => ({
    id: location.id,
    name: location.name,
    position: location.position,
    sensors: location.sensors.map(({ valueAt, ...sensor }) => ({
      ...sensor,
      outages: sensor.outages ?? [],
      readings: buildReadings(valueAt),
    })),
  })),
};

const assert = (condition, message) => {
  if (!condition) throw new Error(`Validación fallida: ${message}`);
};

const validateDataset = (data) => {
  assert(data.locations.length === 3, "se requieren exactamente 3 ubicaciones");

  const sensors = data.locations.flatMap((location) => {
    assert(location.sensors.length === 3, `${location.id} debe tener exactamente 3 sensores`);
    return location.sensors;
  });

  assert(sensors.length === 9, "se requieren exactamente 9 sensores");

  for (const sensor of sensors) {
    assert(
      sensor.readings.length === SAMPLE_COUNT,
      `${sensor.id} debe tener ${SAMPLE_COUNT} lecturas`
    );
    assert(
      sensor.readings[0].timestamp === data.period.start,
      `${sensor.id} debe iniciar en period.start`
    );
    assert(
      sensor.readings.at(-1).timestamp === data.period.end,
      `${sensor.id} debe terminar en period.end`
    );

    sensor.readings.forEach((reading, index) => {
      assert(
        reading.value === null || Number.isFinite(reading.value),
        `${sensor.id} contiene un valor inválido en el índice ${index}`
      );
      if (index === 0) return;

      const previousTimestamp = Date.parse(sensor.readings[index - 1].timestamp);
      const timestamp = Date.parse(reading.timestamp);
      assert(
        timestamp - previousTimestamp === MINUTE_IN_MILLISECONDS,
        `${sensor.id} no mantiene la frecuencia de un minuto en el índice ${index}`
      );
    });
  }

  const scenarios = new Map(sensors.map((sensor) => [sensor.scenario.code, sensor]));
  const upperExcursion = scenarios.get("upper-excursion-recovery");
  const lowerExcursion = scenarios.get("lower-excursion-recovery");
  const intermittentSpikes = scenarios.get("intermittent-spikes");
  const exactLimits = scenarios.get("exact-limits");
  const communicationGap = scenarios.get("communication-gap-recovery");
  const activeCommunicationGap = scenarios.get("active-communication-gap");

  assert(upperExcursion, "falta el escenario de excursión superior");
  assert(
    upperExcursion.readings.some(
      ({ value }) => value !== null && value > upperExcursion.limits.max
    ),
    "la excursión superior no excede el máximo"
  );
  assert(lowerExcursion, "falta el escenario de excursión inferior");
  assert(
    lowerExcursion.readings.some(
      ({ value }) => value !== null && value < lowerExcursion.limits.min
    ),
    "la excursión inferior no baja del mínimo"
  );
  assert(intermittentSpikes, "falta el escenario de picos intermitentes");
  assert(
    intermittentSpikes.readings.filter(
      ({ value }) => value !== null && value > intermittentSpikes.limits.max
    ).length > 6,
    "los picos intermitentes no son suficientes"
  );
  assert(exactLimits, "falta el escenario de límites exactos");
  assert(
    exactLimits.readings.some(({ value }) => value === exactLimits.limits.min) &&
      exactLimits.readings.some(({ value }) => value === exactLimits.limits.max),
    "no hay lecturas en ambos límites exactos"
  );
  assert(communicationGap, "falta el escenario sin comunicación");

  const nullIndexes = communicationGap.readings
    .map(({ value }, index) => (value === null ? index : -1))
    .filter((index) => index >= 0);
  assert(nullIndexes.length === 180, "la brecha debe contener 180 valores nulos");
  assert(
    nullIndexes.every(
      (index, position) => position === 0 || index === nullIndexes[position - 1] + 1
    ),
    "los valores nulos deben ser consecutivos"
  );
  assert(
    communicationGap.readings[nullIndexes[0] - 1].value !== null &&
      communicationGap.readings[nullIndexes.at(-1) + 1].value !== null,
    "debe haber datos válidos antes y después de la brecha"
  );
  assert(activeCommunicationGap, "falta el escenario de sensor sin comunicación");
  assert(
    activeCommunicationGap.readings.slice(-60).every(({ value }) => value === null) &&
      activeCommunicationGap.readings.at(-61).value !== null,
    "el sensor sin comunicación debe terminar con 60 valores nulos consecutivos"
  );
};

validateDataset(dataset);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");

const totalSensors = dataset.locations.reduce(
  (total, location) => total + location.sensors.length,
  0
);
const totalReadings = totalSensors * SAMPLE_COUNT;

console.log(`Archivo generado: ${outputPath}`);
console.log(
  `${dataset.locations.length} ubicaciones, ${totalSensors} sensores, ${totalReadings} lecturas esperadas.`
);
