import { Link } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

import InstitutionalHeader from "layouts/components/InstitutionalHeader";

const pageLinks = [
  {
    title: "Monitoreo actual",
    description:
      "Explora en el mapa las ubicaciones registradas, consulta sus sensores y revisa su temperatura y estado actuales.",
    icon: "location_on",
    path: "/billing",
    buttonLabel: "Ver monitoreo actual",
    ariaLabel: "Ir al mapa de monitoreo actual de ubicaciones y sensores",
    color: "#006D87",
    background: "rgba(0, 145, 179, 0.1)",
  },
  {
    title: "Histórico de temperaturas",
    description:
      "Analiza las lecturas de cada sensor, compáralas con los límites permitidos e identifica alertas o periodos sin datos.",
    icon: "query_stats",
    path: "/historial",
    buttonLabel: "Consultar histórico",
    ariaLabel: "Ir al histórico de temperaturas de los sensores",
    color: "#4F7F16",
    background: "rgba(139, 197, 63, 0.14)",
  },
];

const capabilities = [
  { icon: "place", label: "Ubicaciones georreferenciadas" },
  { icon: "thermostat", label: "Temperaturas y límites permitidos" },
  { icon: "notifications_active", label: "Alertas y continuidad de los sensores" },
];

function Home() {
  return (
    <DashboardLayout>
      <MDBox mt={{ xs: 7, xl: 0 }} mb={3} mx={{ xs: 0, sm: 1 }}>
        <InstitutionalHeader
          badge="Bienvenido"
          badgeIcon="home"
          title="Monitoreo de Temperatura INVIMA"
          description="Plataforma institucional para visualizar, consultar y analizar la información de sensores de temperatura en establecimientos supervisados."
        />

        <Alert
          severity="info"
          sx={{
            mb: 3,
            border: "1px solid rgba(0, 145, 179, 0.2)",
            backgroundColor: "rgba(0, 145, 179, 0.07)",
            color: "#344767",
            "& .MuiAlert-icon": { color: "#006D87" },
          }}
        >
          <strong>Entorno de demostración:</strong> las ubicaciones, sensores y lecturas presentados
          en esta aplicación son datos ficticios creados para ilustrar su funcionamiento.
        </Alert>

        <Card
          component="section"
          aria-labelledby="home-overview-title"
          sx={{
            mb: 3,
            border: "1px solid rgba(52, 71, 103, 0.08)",
            boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
          }}
        >
          <MDBox px={{ xs: 2.5, md: 3.5 }} py={{ xs: 3, md: 3.5 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={5}>
                <MDTypography
                  id="home-overview-title"
                  component="h2"
                  variant="h4"
                  fontWeight="bold"
                  color="dark"
                >
                  Información térmica en un solo lugar
                </MDTypography>
                <MDTypography variant="body2" color="text" mt={1.25}>
                  Esta herramienta facilita el seguimiento de las condiciones de temperatura y
                  permite reconocer oportunamente valores fuera de rango o interrupciones en la
                  comunicación de los sensores.
                </MDTypography>
              </Grid>

              <Grid item xs={12} lg={7}>
                <MDBox
                  component="ul"
                  m={0}
                  p={0}
                  display="grid"
                  sx={{
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                    listStyle: "none",
                  }}
                >
                  {capabilities.map(({ icon, label }) => (
                    <MDBox
                      component="li"
                      key={label}
                      display="flex"
                      alignItems="center"
                      gap={1.25}
                      p={2}
                      sx={{
                        minHeight: "5rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "rgba(0, 145, 179, 0.06)",
                        border: "1px solid rgba(0, 145, 179, 0.12)",
                      }}
                    >
                      <Icon aria-hidden="true" sx={{ color: "#006D87", flexShrink: 0 }}>
                        {icon}
                      </Icon>
                      <MDTypography variant="button" fontWeight="medium" color="dark">
                        {label}
                      </MDTypography>
                    </MDBox>
                  ))}
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

        <MDBox component="section" aria-labelledby="home-navigation-title">
          <MDTypography
            id="home-navigation-title"
            component="h2"
            variant="h5"
            fontWeight="bold"
            color="dark"
            mb={2}
          >
            ¿Qué deseas consultar?
          </MDTypography>

          <Grid container spacing={3} alignItems="stretch">
            {pageLinks.map((page) => (
              <Grid item xs={12} md={6} key={page.path} sx={{ display: "flex" }}>
                <Card
                  component="article"
                  sx={{
                    width: "100%",
                    border: "1px solid rgba(52, 71, 103, 0.08)",
                    boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
                  }}
                >
                  <MDBox
                    height="100%"
                    px={{ xs: 2.5, md: 3 }}
                    py={3}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <MDBox
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      width="3rem"
                      height="3rem"
                      borderRadius="lg"
                      mb={2}
                      sx={{ color: page.color, backgroundColor: page.background }}
                    >
                      <Icon aria-hidden="true" fontSize="medium">
                        {page.icon}
                      </Icon>
                    </MDBox>

                    <MDTypography component="h3" variant="h5" fontWeight="bold" color="dark">
                      {page.title}
                    </MDTypography>
                    <MDTypography variant="body2" color="text" mt={1} mb={2.5}>
                      {page.description}
                    </MDTypography>

                    <MDButton
                      component={Link}
                      to={page.path}
                      variant="contained"
                      color="info"
                      aria-label={page.ariaLabel}
                      sx={{
                        mt: "auto",
                        minHeight: 44,
                        backgroundColor: "#006D87",
                        "&:hover": { backgroundColor: "#004C60" },
                        "&.Mui-focusVisible": {
                          outline: "3px solid #8BC53F",
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {page.buttonLabel}
                      <Icon aria-hidden="true" sx={{ ml: 0.75 }}>
                        arrow_forward
                      </Icon>
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Home;
