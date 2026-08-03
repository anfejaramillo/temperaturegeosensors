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
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const temperatureFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 1,
});

function formatTemperature(value) {
  return `${temperatureFormatter.format(value)} °C`;
}

function Transaction({ sensor }) {
  const isWithinRange =
    sensor.currentTemperature >= sensor.minTemperature &&
    sensor.currentTemperature <= sensor.maxTemperature;
  const color = isWithinRange ? "success" : "error";
  const status = isWithinRange ? "Dentro del rango" : "Fuera del rango";

  return (
    <MDBox
      component="li"
      py={1.5}
      px={1.5}
      mb={1}
      borderRadius="lg"
      sx={{
        border: "1px solid",
        borderColor: "rgba(52, 71, 103, 0.1)",
        backgroundColor: "#FFFFFF",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          borderColor: isWithinRange ? "rgba(76, 175, 80, 0.35)" : "rgba(244, 67, 54, 0.35)",
          boxShadow: "0 5px 16px rgba(15, 65, 81, 0.06)",
        },
      }}
    >
      <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
        <MDBox display="flex" alignItems="flex-start" mr={2} mb={1}>
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="2.5rem"
            height="2.5rem"
            mr={1.5}
            borderRadius="50%"
            bgColor={color}
            color="white"
            lineHeight={0}
            aria-hidden="true"
          >
            <Icon sx={{ fontWeight: "bold" }}>{isWithinRange ? "check" : "priority_high"}</Icon>
          </MDBox>
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {sensor.name}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Rango permitido: {formatTemperature(sensor.minTemperature)}–
              {formatTemperature(sensor.maxTemperature)}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-end" ml="auto">
          <MDTypography variant="caption" color="text" fontWeight="regular">
            Temperatura actual
          </MDTypography>
          <MDTypography variant="h6" color={color} fontWeight="medium">
            {formatTemperature(sensor.currentTemperature)}
          </MDTypography>
          <MDTypography variant="caption" color={color} fontWeight="bold">
            {status}
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

Transaction.propTypes = {
  sensor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    currentTemperature: PropTypes.number.isRequired,
    minTemperature: PropTypes.number.isRequired,
    maxTemperature: PropTypes.number.isRequired,
  }).isRequired,
};

export default Transaction;
