import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Institutional identity assets
import invimaLogo from "assets/images/institutional/invima-logo.png";
import minsaludLogo from "assets/images/institutional/minsalud-logo.png";
import govcoLogoInverso from "assets/images/institutional/govco-logo-inverso.svg";

const institutions = [
  {
    name: "INVIMA",
    logo: invimaLogo,
    alt: "Logotipo del Instituto Nacional de Vigilancia de Medicamentos y Alimentos, INVIMA",
    primary: true,
  },
  {
    name: "Ministerio de Salud y Protección Social",
    logo: minsaludLogo,
    alt: "Logotipo del Ministerio de Salud y Protección Social de Colombia",
  },
  {
    name: "Portal oficial GOV.CO",
    logo: govcoLogoInverso,
    alt: "Logotipo del portal oficial GOV.CO",
    inverse: true,
  },
];

function InstitutionalHeader({ badge, badgeIcon, title, description }) {
  return (
    <Card
      component="header"
      sx={{
        mb: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "rgba(0, 145, 179, 0.16)",
        boxShadow: "0 8px 32px rgba(15, 65, 81, 0.08)",
      }}
    >
      <MDBox
        aria-hidden="true"
        sx={{
          height: 6,
          background: "linear-gradient(90deg, #0091B3 0%, #0091B3 72%, #8BC53F 72%)",
        }}
      />
      <MDBox px={{ xs: 2.5, md: 3.5 }} py={{ xs: 2.5, md: 3 }}>
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Chip
              icon={<Icon sx={{ fontSize: "1rem !important" }}>{badgeIcon}</Icon>}
              label={badge}
              size="small"
              sx={{
                mb: 1.5,
                color: "#006D87",
                backgroundColor: "rgba(0, 145, 179, 0.1)",
                fontWeight: 600,
                "& .MuiChip-icon": { color: "#0091B3" },
              }}
            />
            <MDTypography component="h1" variant="h3" fontWeight="bold" color="dark">
              {title}
            </MDTypography>
            <MDTypography variant="body2" color="text" mt={1} sx={{ maxWidth: 620 }}>
              {description}
            </MDTypography>
          </Grid>

          <Grid item xs={12} lg={6}>
            <MDBox
              component="ul"
              display="grid"
              p={0}
              m={0}
              sx={{
                gridTemplateColumns: { xs: "1fr", sm: "1.15fr 1fr 1fr" },
                gap: { xs: 2, sm: 2.5 },
                alignItems: "center",
                listStyle: "none",
              }}
              aria-label="Entidades participantes"
            >
              {institutions.map((institution) => (
                <MDBox
                  component="li"
                  key={institution.name}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    minHeight: { xs: 54, sm: 66 },
                    px: { xs: 1, sm: 1.5 },
                    py: institution.inverse ? 1.25 : 0,
                    backgroundColor: institution.inverse ? "#006D87" : "transparent",
                    borderRadius: institution.inverse ? "0.6rem" : 0,
                    borderLeft: {
                      xs: "none",
                      sm:
                        institution.primary || institution.inverse
                          ? "none"
                          : "1px solid rgba(52, 71, 103, 0.12)",
                    },
                  }}
                >
                  <MDBox
                    component="img"
                    src={institution.logo}
                    alt={institution.alt}
                    sx={{
                      display: "block",
                      width: "100%",
                      maxWidth: institution.primary ? 210 : institution.inverse ? 125 : 150,
                      maxHeight: institution.primary ? 68 : institution.inverse ? 44 : 58,
                      objectFit: "contain",
                    }}
                  />
                </MDBox>
              ))}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

InstitutionalHeader.propTypes = {
  badge: PropTypes.string.isRequired,
  badgeIcon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default InstitutionalHeader;
