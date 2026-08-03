/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

function Transactions({ place }) {
  const sensorsWithinRange = place.sensors.filter(
    ({ currentTemperature, minTemperature, maxTemperature }) =>
      currentTemperature >= minTemperature && currentTemperature <= maxTemperature
  ).length;
  const sensorsOutsideRange = place.sensors.length - sensorsWithinRange;

  return (
    <Card
      component="section"
      aria-labelledby="sensor-list-title"
      sx={{
        height: "100%",
        overflow: "hidden",
        border: "1px solid rgba(52, 71, 103, 0.08)",
        boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
      }}
    >
      <MDBox
        px={{ xs: 2, sm: 2.5 }}
        py={2}
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
            sx={{ backgroundColor: "rgba(0, 145, 179, 0.1)", color: "#0091B3" }}
            aria-hidden="true"
          >
            <Icon>sensors</Icon>
          </MDBox>
          <MDBox>
            <MDTypography id="sensor-list-title" component="h2" variant="h6" fontWeight="bold">
              Sensores de temperatura
            </MDTypography>
            <MDTypography
              variant="caption"
              color="text"
              fontWeight="regular"
              aria-live="polite"
              aria-atomic="true"
            >
              {place.name}
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox display="flex" flexWrap="wrap" gap={1} mt={2} aria-label="Resumen de sensores">
          <Chip
            size="small"
            label={`${place.sensors.length} sensores`}
            sx={{
              fontWeight: 600,
              color: "#006D87",
              backgroundColor: "rgba(0, 145, 179, 0.1)",
            }}
          />
          <Chip
            size="small"
            label={`${sensorsWithinRange} en rango`}
            sx={{
              fontWeight: 600,
              color: "#2E7D32",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
            }}
          />
          {sensorsOutsideRange > 0 && (
            <Chip
              size="small"
              label={`${sensorsOutsideRange} fuera de rango`}
              sx={{
                fontWeight: 600,
                color: "#C62828",
                backgroundColor: "rgba(244, 67, 54, 0.1)",
              }}
            />
          )}
        </MDBox>
      </MDBox>

      <MDBox pt={2} pb={1.5} px={{ xs: 1.5, sm: 2 }}>
        {place.sensors.length > 0 ? (
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            {place.sensors.map((sensor) => (
              <Transaction key={sensor.id} sensor={sensor} />
            ))}
          </MDBox>
        ) : (
          <MDTypography variant="body2" color="text">
            Este lugar no tiene sensores de temperatura registrados.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

Transactions.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sensors: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        currentTemperature: PropTypes.number.isRequired,
        minTemperature: PropTypes.number.isRequired,
        maxTemperature: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Transactions;
