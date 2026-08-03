import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { formatDateTime } from "layouts/temperature-history/utils/historyData";

function HistoryFilters({
  locations,
  selectedLocationId,
  selectedSensorId,
  onLocationChange,
  onSensorChange,
  samplingIntervalMinutes,
  period,
  timezone,
}) {
  const selectedLocation = locations.find(({ id }) => id === selectedLocationId) || null;
  const sensors = selectedLocation?.sensors || [];
  const selectedSensor = sensors.find(({ id }) => id === selectedSensorId) || null;

  return (
    <Card
      component="section"
      aria-labelledby="history-filters-title"
      sx={{
        mb: 3,
        border: "1px solid rgba(52, 71, 103, 0.08)",
        boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
      }}
    >
      <MDBox px={{ xs: 2, sm: 2.5 }} py={{ xs: 2.25, sm: 2.5 }}>
        <MDBox display="flex" alignItems="center" mb={2.5}>
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
            <Icon>tune</Icon>
          </MDBox>
          <MDBox>
            <MDTypography id="history-filters-title" component="h2" variant="h6" fontWeight="bold">
              Selección del histórico
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Elige primero una ubicación y después uno de sus sensores.
            </MDTypography>
          </MDBox>
        </MDBox>

        <Grid container spacing={2.5} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="history-location-label">Ubicación</InputLabel>
              <Select
                labelId="history-location-label"
                id="history-location-select"
                value={selectedLocationId}
                label="Ubicación"
                onChange={(event) => onLocationChange(event.target.value)}
                inputProps={{ "aria-describedby": "history-location-help" }}
                sx={{ minHeight: 44 }}
              >
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
              <MDTypography id="history-location-help" variant="caption" color="text" mt={0.75}>
                {locations.length} ubicaciones disponibles
              </MDTypography>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" disabled={!sensors.length}>
              <InputLabel id="history-sensor-label">Sensor de temperatura</InputLabel>
              <Select
                labelId="history-sensor-label"
                id="history-sensor-select"
                value={selectedSensorId}
                label="Sensor de temperatura"
                onChange={(event) => onSensorChange(event.target.value)}
                inputProps={{ "aria-describedby": "history-sensor-help" }}
                sx={{ minHeight: 44 }}
              >
                {sensors.map((sensor) => (
                  <MenuItem key={sensor.id} value={sensor.id}>
                    {sensor.name}
                  </MenuItem>
                ))}
              </Select>
              <MDTypography id="history-sensor-help" variant="caption" color="text" mt={0.75}>
                {sensors.length
                  ? `${sensors.length} sensores en esta ubicación`
                  : "Esta ubicación no tiene sensores"}
              </MDTypography>
            </FormControl>
          </Grid>
        </Grid>

        <MDBox display="flex" flexWrap="wrap" gap={1} mt={2.5} aria-label="Periodo consultado">
          <Chip
            size="small"
            icon={<Icon sx={{ fontSize: "1rem !important" }}>schedule</Icon>}
            label={`Cada ${samplingIntervalMinutes} min`}
            sx={{
              color: "#006D87",
              backgroundColor: "rgba(0, 145, 179, 0.1)",
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#006D87" },
            }}
          />
          {period.start && period.end && (
            <Chip
              size="small"
              label={`${formatDateTime(period.start, timezone)} — ${formatDateTime(
                period.end,
                timezone
              )}`}
              sx={{
                maxWidth: "100%",
                height: "auto",
                color: "#344767",
                backgroundColor: "rgba(52, 71, 103, 0.07)",
                fontWeight: 600,
                "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "normal",
                  py: 0.5,
                },
              }}
            />
          )}
          {selectedSensor && (
            <Chip
              size="small"
              label={`${selectedSensor.readings.length.toLocaleString("es-CO")} muestras`}
              sx={{
                color: "#2E7D32",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                fontWeight: 600,
              }}
            />
          )}
        </MDBox>

        {(selectedSensor?.scenario?.label || selectedSensor?.scenario?.description) && (
          <MDBox
            mt={2}
            px={1.5}
            py={1.25}
            borderRadius="lg"
            sx={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}
          >
            <MDTypography variant="caption" color="dark">
              <strong>Escenario de demostración:</strong>{" "}
              {selectedSensor.scenario.label || "Escenario especial"}
              {selectedSensor.scenario.description
                ? ` — ${selectedSensor.scenario.description}`
                : ""}
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

HistoryFilters.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          scenario: PropTypes.shape({
            code: PropTypes.string,
            label: PropTypes.string,
            description: PropTypes.string,
          }),
          readings: PropTypes.arrayOf(PropTypes.object).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  selectedLocationId: PropTypes.string.isRequired,
  selectedSensorId: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onSensorChange: PropTypes.func.isRequired,
  samplingIntervalMinutes: PropTypes.number.isRequired,
  period: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};

export default HistoryFilters;
