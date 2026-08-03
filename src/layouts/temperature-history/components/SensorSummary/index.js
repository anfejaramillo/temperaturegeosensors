import { useMemo } from "react";
import PropTypes from "prop-types";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import LinearProgress from "@mui/material/LinearProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import {
  calculateSensorSummary,
  formatDateTime,
  formatDuration,
  formatPercentage,
  formatTemperature,
} from "layouts/temperature-history/utils/historyData";

function SummaryItem({ icon, label, value, detail, tone }) {
  return (
    <MDBox
      height="100%"
      p={2}
      borderRadius="lg"
      sx={{
        backgroundColor: "#FAFCFD",
        border: "1px solid rgba(52, 71, 103, 0.08)",
      }}
    >
      <MDBox display="flex" alignItems="flex-start">
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="2.4rem"
          height="2.4rem"
          mr={1.25}
          borderRadius="lg"
          sx={{ backgroundColor: `${tone}18`, color: tone, flexShrink: 0 }}
          aria-hidden="true"
        >
          <Icon fontSize="small">{icon}</Icon>
        </MDBox>
        <MDBox minWidth={0}>
          <MDTypography component="h3" variant="caption" color="text" fontWeight="medium">
            {label}
          </MDTypography>
          <MDTypography
            component="p"
            variant="h6"
            color="dark"
            fontWeight="bold"
            sx={{ overflowWrap: "anywhere" }}
          >
            {value}
          </MDTypography>
          <MDTypography component="p" variant="caption" color="text" mt={0.25}>
            {detail}
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

SummaryItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  tone: PropTypes.string.isRequired,
};

function SensorSummary({ sensor, unit, timezone, samplingIntervalMinutes }) {
  const summary = useMemo(
    () => calculateSensorSummary(sensor, samplingIntervalMinutes),
    [sensor, samplingIntervalMinutes]
  );
  const recentMissingPeriods = [...summary.missingPeriods].reverse().slice(0, 3);
  const outsidePercentage = summary.receivedCount
    ? (summary.outOfRangeCount / summary.receivedCount) * 100
    : 0;

  const communicationMessage = summary.currentMissingPeriod
    ? `No se han recibido datos durante ${formatDuration(
        summary.currentMissingPeriod.durationMinutes
      )}. La última lectura válida fue ${formatDateTime(
        summary.latestValidReading?.timestamp,
        timezone
      )}.`
    : `Se detectaron ${summary.missingPeriods.length} periodo${
        summary.missingPeriods.length === 1 ? "" : "s"
      } sin datos. El intervalo más largo duró ${formatDuration(
        summary.longestMissingPeriod?.durationMinutes || 0
      )}.`;

  return (
    <Card
      component="section"
      aria-labelledby="sensor-summary-title"
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
            <Icon>analytics</Icon>
          </MDBox>
          <MDBox>
            <MDTypography id="sensor-summary-title" component="h2" variant="h6" fontWeight="bold">
              Resumen del sensor
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Estadísticas calculadas sin interpolar datos ausentes
            </MDTypography>
          </MDBox>
        </MDBox>

        <Chip
          size="small"
          label={`${formatTemperature(sensor.limits.min, unit)} a ${formatTemperature(
            sensor.limits.max,
            unit
          )}`}
          sx={{
            color: "#1B5E20",
            backgroundColor: "rgba(76, 175, 80, 0.12)",
            fontWeight: 700,
          }}
        />
      </MDBox>

      <MDBox px={{ xs: 2, sm: 2.5 }} py={2.5}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <SummaryItem
              icon="thermostat"
              label="Última lectura válida"
              value={formatTemperature(summary.latestValidReading?.value, unit)}
              detail={formatDateTime(summary.latestValidReading?.timestamp, timezone)}
              tone="#006D87"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SummaryItem
              icon="ssid_chart"
              label="Promedio"
              value={formatTemperature(summary.average, unit)}
              detail={`Mín. ${formatTemperature(summary.minimum, unit)} · Máx. ${formatTemperature(
                summary.maximum,
                unit
              )}`}
              tone="#5E35B1"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SummaryItem
              icon="warning_amber"
              label="Fuera de rango"
              value={`${summary.outOfRangeCount.toLocaleString("es-CO")} lecturas`}
              detail={`${formatPercentage(outsidePercentage)} de los datos recibidos`}
              tone={summary.outOfRangeCount ? "#C62828" : "#2E7D32"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SummaryItem
              icon="signal_wifi_statusbar_connected_no_internet_4"
              label="Sin datos"
              value={formatDuration(summary.missingCount * samplingIntervalMinutes)}
              detail={`${summary.missingPeriods.length.toLocaleString("es-CO")} periodo${
                summary.missingPeriods.length === 1 ? "" : "s"
              } sin comunicación`}
              tone={summary.missingCount ? "#EF6C00" : "#2E7D32"}
            />
          </Grid>
        </Grid>

        <MDBox mt={2} p={2} borderRadius="lg" sx={{ backgroundColor: "#FAFCFD" }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDTypography variant="button" fontWeight="bold" color="dark">
              Cobertura de datos
            </MDTypography>
            <MDTypography variant="button" fontWeight="bold" color="dark">
              {formatPercentage(summary.coverage)}
            </MDTypography>
          </MDBox>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, summary.coverage))}
            aria-label={`Cobertura de datos ${formatPercentage(summary.coverage)}`}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: "rgba(52, 71, 103, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: summary.coverage >= 99 ? "#2E7D32" : "#EF6C00",
              },
            }}
          />
          <MDTypography component="p" variant="caption" color="text" mt={1}>
            {summary.receivedCount.toLocaleString("es-CO")} recibidas de{" "}
            {summary.total.toLocaleString("es-CO")} lecturas esperadas.
          </MDTypography>
        </MDBox>

        {summary.missingCount ? (
          <Alert
            severity={summary.isOffline ? "error" : "warning"}
            sx={{ mt: 2.5, alignItems: "flex-start", borderRadius: "0.75rem" }}
            role="status"
          >
            <AlertTitle sx={{ fontWeight: 700 }}>
              {summary.isOffline ? "Sensor sin comunicación" : "Se detectaron periodos sin datos"}
            </AlertTitle>
            {communicationMessage}
            <MDBox component="ul" m={0} mt={1} pl={2.25}>
              {recentMissingPeriods.map((period) => (
                <MDTypography
                  component="li"
                  variant="caption"
                  color="inherit"
                  key={`${period.start}-${period.end}`}
                >
                  {formatDateTime(period.start, timezone)} — {formatDateTime(period.end, timezone)}
                  {` (${formatDuration(period.durationMinutes)})`}
                </MDTypography>
              ))}
            </MDBox>
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mt: 2.5, borderRadius: "0.75rem" }} role="status">
            <AlertTitle sx={{ fontWeight: 700 }}>Comunicación continua</AlertTitle>
            El sensor reportó datos durante todo el periodo consultado.
          </Alert>
        )}
      </MDBox>
    </Card>
  );
}

SensorSummary.propTypes = {
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
  unit: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  samplingIntervalMinutes: PropTypes.number.isRequired,
};

export default SensorSummary;
