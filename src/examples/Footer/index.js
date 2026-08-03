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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Institutional assets
import minsaludLogo from "assets/images/institutional/minsalud-logo.png";
import govcoLogoInverso from "assets/images/institutional/govco-logo-inverso.svg";

function Footer() {
  return (
    <MDBox component="footer" width="100%" mt={3} px={{ xs: 1, sm: 1.5 }}>
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "center" }}
        gap={3}
        px={{ xs: 2.5, md: 3.5 }}
        py={{ xs: 2.5, md: 3 }}
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 111, 133, 0.16)",
          borderTop: "3px solid #008fa8",
          borderRadius: "0.75rem",
          boxShadow: "0 0.25rem 1rem rgba(29, 53, 64, 0.06)",
        }}
      >
        <MDBox maxWidth={{ xs: "100%", lg: "34rem" }}>
          <MDTypography component="p" variant="h6" fontWeight="bold" color="dark" mb={0.5}>
            Monitoreo de Temperatura INVIMA
          </MDTypography>
          <MDTypography component="p" variant="button" fontWeight="regular" color="text">
            Proyecto institucional autorizado para el seguimiento de sensores y condiciones
            térmicas.
          </MDTypography>
        </MDBox>

        <MDBox
          width={{ xs: "100%", lg: "auto" }}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent={{ xs: "flex-start", lg: "flex-end" }}
          gap={{ xs: 2, sm: 3 }}
        >
          <MDBox
            component="img"
            src={minsaludLogo}
            alt="Logotipo oficial del Ministerio de Salud y Protección Social de Colombia"
            sx={{
              display: "block",
              width: "auto",
              maxWidth: { xs: "10.5rem", sm: "12rem" },
              height: { xs: "2.75rem", sm: "3.25rem" },
              objectFit: "contain",
            }}
          />
          <MDBox
            ml={{ xs: 0, sm: 0.5 }}
            px={{ xs: 2, sm: 2.5 }}
            py={1.25}
            sx={{
              backgroundColor: "#006D87",
              borderRadius: "0.6rem",
            }}
          >
            <MDBox
              component="img"
              src={govcoLogoInverso}
              alt="Logotipo del portal oficial GOV.CO"
              sx={{
                display: "block",
                width: "auto",
                maxWidth: { xs: "8.5rem", sm: "9.5rem" },
                height: { xs: "2rem", sm: "2.25rem" },
                objectFit: "contain",
              }}
            />
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default Footer;
