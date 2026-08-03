import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

import InstitutionalHeader from "layouts/components/InstitutionalHeader";
import HistoryFilters from "layouts/temperature-history/components/HistoryFilters";
import SensorSummary from "layouts/temperature-history/components/SensorSummary";
import TemperatureHistoryChart from "layouts/temperature-history/components/TemperatureHistoryChart";
import { normalizeHistoryDataset } from "layouts/temperature-history/utils/historyData";

const HISTORY_DATA_URL = `${process.env.PUBLIC_URL}/data/temperature-history.json`;

function PageState({ icon, title, description, children, role }) {
  return (
    <Card
      component="section"
      role={role}
      aria-live="polite"
      sx={{
        border: "1px solid rgba(52, 71, 103, 0.08)",
        boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
      }}
    >
      <MDBox
        minHeight="18rem"
        px={3}
        py={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        {icon}
        <MDTypography component="h2" variant="h5" fontWeight="bold" mt={2}>
          {title}
        </MDTypography>
        <MDTypography variant="body2" color="text" mt={1} sx={{ maxWidth: 560 }}>
          {description}
        </MDTypography>
        {children}
      </MDBox>
    </Card>
  );
}

PageState.defaultProps = {
  children: null,
  role: "status",
};

PageState.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node,
  role: PropTypes.string.isRequired,
};

function TemperatureHistory() {
  const [dataset, setDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedSensorId, setSelectedSensorId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(HISTORY_DATA_URL, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`El servidor respondió con el estado ${response.status}.`);
        }

        const payload = await response.json();
        const normalizedDataset = normalizeHistoryDataset(payload);
        const firstLocation = normalizedDataset.locations[0] || null;
        const firstSensor = firstLocation?.sensors[0] || null;

        setDataset(normalizedDataset);
        setSelectedLocationId(firstLocation?.id || "");
        setSelectedSensorId(firstSensor?.id || "");
      } catch (error) {
        if (error.name !== "AbortError") {
          setDataset(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado al cargar el histórico."
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [retryCount]);

  const selectedLocation = useMemo(
    () =>
      dataset?.locations.find(({ id }) => id === selectedLocationId) ||
      dataset?.locations[0] ||
      null,
    [dataset, selectedLocationId]
  );

  const selectedSensor = useMemo(
    () =>
      selectedLocation?.sensors.find(({ id }) => id === selectedSensorId) ||
      selectedLocation?.sensors[0] ||
      null,
    [selectedLocation, selectedSensorId]
  );

  const handleLocationChange = (locationId) => {
    const nextLocation = dataset.locations.find(({ id }) => id === locationId) || null;

    setSelectedLocationId(locationId);
    setSelectedSensorId(nextLocation?.sensors[0]?.id || "");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <PageState
          icon={<CircularProgress size={44} sx={{ color: "#006D87" }} />}
          title="Cargando datos históricos"
          description="Estamos leyendo el archivo local de temperaturas."
        />
      );
    }

    if (errorMessage) {
      return (
        <PageState
          role="alert"
          icon={
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="3.5rem"
              height="3.5rem"
              borderRadius="lg"
              sx={{ color: "#B71C1C", backgroundColor: "rgba(211, 47, 47, 0.12)" }}
            >
              <Icon fontSize="large">error_outline</Icon>
            </MDBox>
          }
          title="No fue posible cargar el histórico"
          description={errorMessage}
        >
          <Alert severity="error" sx={{ mt: 2, maxWidth: 640, textAlign: "left" }}>
            <AlertTitle sx={{ fontWeight: 700 }}>Archivo no disponible o inválido</AlertTitle>
            Verifica que exista <code>public/data/temperature-history.json</code> y que conserve la
            estructura esperada.
          </Alert>
          <MDButton
            variant="contained"
            color="info"
            onClick={() => setRetryCount((current) => current + 1)}
            sx={{ mt: 2.5, backgroundColor: "#006D87", "&:hover": { backgroundColor: "#004C60" } }}
          >
            <Icon sx={{ mr: 0.75 }}>refresh</Icon>
            Reintentar
          </MDButton>
        </PageState>
      );
    }

    if (!dataset?.locations.length) {
      return (
        <PageState
          icon={
            <MDBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="3.5rem"
              height="3.5rem"
              borderRadius="lg"
              sx={{ color: "#006D87", backgroundColor: "rgba(0, 145, 179, 0.1)" }}
            >
              <Icon fontSize="large">location_off</Icon>
            </MDBox>
          }
          title="No hay ubicaciones disponibles"
          description="El archivo histórico no contiene ubicaciones para consultar."
        />
      );
    }

    return (
      <>
        <HistoryFilters
          locations={dataset.locations}
          selectedLocationId={selectedLocation?.id || ""}
          selectedSensorId={selectedSensor?.id || ""}
          onLocationChange={handleLocationChange}
          onSensorChange={setSelectedSensorId}
          samplingIntervalMinutes={dataset.samplingIntervalMinutes}
          period={dataset.period}
          timezone={dataset.timezone}
        />

        {!selectedSensor ? (
          <PageState
            icon={
              <MDBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="3.5rem"
                height="3.5rem"
                borderRadius="lg"
                sx={{ color: "#006D87", backgroundColor: "rgba(0, 145, 179, 0.1)" }}
              >
                <Icon fontSize="large">sensors_off</Icon>
              </MDBox>
            }
            title="No hay sensores disponibles"
            description="La ubicación seleccionada no tiene sensores de temperatura registrados."
          />
        ) : !selectedSensor.readings.length ? (
          <PageState
            icon={
              <MDBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="3.5rem"
                height="3.5rem"
                borderRadius="lg"
                sx={{ color: "#EF6C00", backgroundColor: "rgba(239, 108, 0, 0.1)" }}
              >
                <Icon fontSize="large">insert_chart_outlined</Icon>
              </MDBox>
            }
            title="El sensor no tiene lecturas"
            description="Selecciona otro sensor para consultar su histórico de temperatura."
          />
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} lg={8}>
              <TemperatureHistoryChart
                sensor={selectedSensor}
                locationName={selectedLocation.name}
                unit={dataset.unit}
                timezone={dataset.timezone}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <SensorSummary
                sensor={selectedSensor}
                unit={dataset.unit}
                timezone={dataset.timezone}
                samplingIntervalMinutes={dataset.samplingIntervalMinutes}
              />
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  return (
    <DashboardLayout>
      <MDBox mt={{ xs: 7, xl: 0 }} mb={3} mx={{ xs: 0, sm: 1 }}>
        <InstitutionalHeader
          badge="Datos históricos de demostración"
          badgeIcon="history"
          title="Monitoreo de Temperatura INVIMA"
          description="Consulta el comportamiento histórico, los límites permitidos y la continuidad de comunicación de cada sensor."
        />
        {renderContent()}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TemperatureHistory;
