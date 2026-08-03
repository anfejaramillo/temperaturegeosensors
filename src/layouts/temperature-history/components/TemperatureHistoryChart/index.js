import { useMemo } from "react";
import PropTypes from "prop-types";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import {
  formatChartTick,
  formatDateTime,
  formatTemperature,
} from "layouts/temperature-history/utils/historyData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function getReadingStatus(sensor) {
  const latestReading = sensor.readings[sensor.readings.length - 1];

  if (!latestReading || latestReading.value === null) {
    return {
      label: "Sensor sin comunicación",
      color: "#B71C1C",
      backgroundColor: "rgba(211, 47, 47, 0.12)",
      icon: "wifi_off",
    };
  }

  if (latestReading.value < sensor.limits.min || latestReading.value > sensor.limits.max) {
    return {
      label: "Última lectura fuera de rango",
      color: "#B71C1C",
      backgroundColor: "rgba(211, 47, 47, 0.12)",
      icon: "warning",
    };
  }

  return {
    label: "Última lectura en rango",
    color: "#1B5E20",
    backgroundColor: "rgba(46, 125, 50, 0.12)",
    icon: "check_circle",
  };
}

function TemperatureHistoryChart({ sensor, locationName, unit, timezone }) {
  const status = getReadingStatus(sensor);

  const chartData = useMemo(() => {
    const labels = sensor.readings.map(({ timestamp }) => timestamp);
    const minimumValues = sensor.readings.map(() => sensor.limits.min);
    const maximumValues = sensor.readings.map(() => sensor.limits.max);
    const temperatureValues = sensor.readings.map(({ value }) => value);
    const pointColors = sensor.readings.map(({ value }) => {
      if (value === null) return "transparent";
      return value < sensor.limits.min || value > sensor.limits.max ? "#C62828" : "#007F9D";
    });
    const pointRadii = sensor.readings.map(({ value }) => {
      if (value === null) return 0;
      return value < sensor.limits.min || value > sensor.limits.max ? 3.5 : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Límite mínimo",
          data: minimumValues,
          borderColor: "#2E7D32",
          backgroundColor: "#2E7D32",
          borderWidth: 1.5,
          borderDash: [7, 5],
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          spanGaps: true,
          order: 4,
        },
        {
          label: "Rango permitido",
          data: maximumValues,
          borderColor: "transparent",
          backgroundColor: "rgba(76, 175, 80, 0.12)",
          borderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: "-1",
          spanGaps: true,
          order: 5,
        },
        {
          label: "Límite máximo",
          data: maximumValues,
          borderColor: "#EF6C00",
          backgroundColor: "#EF6C00",
          borderWidth: 1.5,
          borderDash: [7, 5],
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          spanGaps: true,
          order: 3,
        },
        {
          label: "Temperatura",
          data: temperatureValues,
          borderColor: "#006D87",
          backgroundColor: "#006D87",
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointRadius: pointRadii,
          pointHoverRadius: 5,
          pointHitRadius: 8,
          borderWidth: 2,
          fill: false,
          spanGaps: false,
          tension: 0.12,
          order: 1,
        },
      ],
    };
  }, [sensor]);

  const chartOptions = useMemo(() => {
    const numericValues = sensor.readings
      .map(({ value }) => value)
      .filter((value) => typeof value === "number" && Number.isFinite(value));
    const observedMinimum = numericValues.length ? Math.min(...numericValues) : sensor.limits.min;
    const observedMaximum = numericValues.length ? Math.max(...numericValues) : sensor.limits.max;
    const suggestedMinimum = Math.floor(Math.min(observedMinimum, sensor.limits.min) - 2);
    const suggestedMaximum = Math.ceil(Math.max(observedMaximum, sensor.limits.max) + 2);

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      normalized: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "start",
          labels: {
            color: "#344767",
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            padding: 18,
            font: { size: 11, weight: "600" },
          },
        },
        tooltip: {
          backgroundColor: "rgba(31, 45, 61, 0.96)",
          padding: 12,
          displayColors: true,
          callbacks: {
            title: (items) => (items.length ? formatDateTime(items[0].label, timezone) : "Lectura"),
            label: (context) => {
              if (context.dataset.label === "Rango permitido") return null;
              return `${context.dataset.label}: ${formatTemperature(context.raw, unit)}`;
            },
            afterBody: (items) => {
              const dataIndex = items[0]?.dataIndex;
              if (dataIndex === undefined || sensor.readings[dataIndex]?.value !== null) return [];
              return ["Temperatura: sin datos del sensor"];
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { color: "rgba(52, 71, 103, 0.18)" },
          ticks: {
            color: "#607D8B",
            autoSkip: true,
            maxTicksLimit: 10,
            maxRotation: 0,
            padding: 10,
            callback(value) {
              return formatChartTick(this.getLabelForValue(value), timezone);
            },
          },
          title: {
            display: true,
            text: "Fecha y hora",
            color: "#344767",
            font: { weight: "600" },
          },
        },
        y: {
          suggestedMin: suggestedMinimum,
          suggestedMax: suggestedMaximum,
          grid: {
            color: "rgba(52, 71, 103, 0.08)",
            borderDash: [4, 4],
          },
          border: { display: false },
          ticks: {
            color: "#607D8B",
            padding: 10,
            callback: (value) => `${value} ${unit}`,
          },
          title: {
            display: true,
            text: `Temperatura (${unit})`,
            color: "#344767",
            font: { weight: "600" },
          },
        },
      },
    };
  }, [sensor, timezone, unit]);

  return (
    <Card
      component="section"
      aria-labelledby="temperature-chart-title"
      sx={{
        height: "100%",
        border: "1px solid rgba(52, 71, 103, 0.08)",
        boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
      }}
    >
      <MDBox
        px={{ xs: 2, sm: 2.5 }}
        py={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1.5}
        sx={{ borderBottom: "1px solid rgba(52, 71, 103, 0.08)" }}
      >
        <MDBox display="flex" alignItems="center">
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="2.75rem"
            height="2.75rem"
            mr={1.5}
            borderRadius="lg"
            sx={{ backgroundColor: "rgba(0, 145, 179, 0.1)", color: "#006D87" }}
            aria-hidden="true"
          >
            <Icon>show_chart</Icon>
          </MDBox>
          <MDBox>
            <MDTypography
              id="temperature-chart-title"
              component="h2"
              variant="h6"
              fontWeight="bold"
            >
              Histórico de temperatura
            </MDTypography>
            <MDTypography id="temperature-chart-description" variant="caption" color="text">
              {locationName} · {sensor.name}
            </MDTypography>
          </MDBox>
        </MDBox>

        <Chip
          size="small"
          icon={<Icon sx={{ fontSize: "1rem !important" }}>{status.icon}</Icon>}
          label={status.label}
          sx={{
            height: "auto",
            color: status.color,
            backgroundColor: status.backgroundColor,
            fontWeight: 700,
            "& .MuiChip-icon": { color: status.color },
            "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 },
          }}
        />
      </MDBox>

      <MDBox px={{ xs: 1, sm: 2 }} pt={2} pb={1.5}>
        <MDBox
          height={{ xs: "23rem", md: "29rem" }}
          role="group"
          aria-label={`Gráfica histórica de ${sensor.name}`}
        >
          <Line
            data={chartData}
            options={chartOptions}
            role="img"
            aria-label={`Temperatura histórica del sensor ${sensor.name}. Las líneas discontinuas muestran los límites mínimo y máximo; los puntos rojos indican lecturas fuera de rango y los cortes indican periodos sin datos.`}
            aria-describedby="temperature-chart-description"
          />
        </MDBox>
        <MDTypography component="p" variant="caption" color="text" mt={1} px={1}>
          Los puntos rojos son lecturas fuera del rango. Los cortes en la línea azul representan
          minutos sin datos; no se interpolan valores faltantes.
        </MDTypography>
      </MDBox>
    </Card>
  );
}

TemperatureHistoryChart.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    limits: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    readings: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        value: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  locationName: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};

export default TemperatureHistoryChart;
