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
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Google Maps
import GoogleMapReact from "google-map-react";

const defaultMapPosition = {
  center: {
    lat: 4.814960579227709,
    lng: -75.70165594076136,
  },
  zoom: 13,
};

function PlaceMarker({ place, isSelected, onSelect }) {
  return (
    <Button
      type="button"
      variant={isSelected ? "contained" : "outlined"}
      color="info"
      size="small"
      onClick={() => onSelect(place.id)}
      aria-label={"Ver sensores de " + place.name}
      aria-pressed={isSelected}
      sx={{
        minWidth: "max-content",
        minHeight: 40,
        px: 1.5,
        py: 0.75,
        borderRadius: 4,
        border: "2px solid",
        borderColor: isSelected ? "#004C60" : "#00566B",
        boxShadow: isSelected
          ? "0 6px 16px rgba(0, 76, 96, 0.32)"
          : "0 3px 12px rgba(0, 47, 59, 0.24)",
        color: isSelected ? "#FFFFFF" : "#00566B",
        backgroundColor: isSelected ? "#006D87" : "#FFFFFF",
        textTransform: "none",
        fontSize: "0.8125rem",
        fontWeight: 700,
        lineHeight: 1.2,
        transform: "translate(-50%, -50%)",
        whiteSpace: "nowrap",
        "&:hover": {
          backgroundColor: isSelected ? "#004C60" : "#E8F6F9",
          color: isSelected ? "#FFFFFF" : "#004C60",
          borderColor: "#004C60",
        },
        "&.Mui-focusVisible": {
          zIndex: 3,
          boxShadow: "0 0 0 3px #FFFFFF, 0 0 0 6px #002F3B, 0 6px 16px rgba(0, 47, 59, 0.28)",
        },
        "&:active": {
          opacity: 1,
          backgroundColor: isSelected ? "#003F50" : "#D9F0F4",
          color: isSelected ? "#FFFFFF" : "#003F50",
        },
      }}
    >
      {place.name}
    </Button>
  );
}

PlaceMarker.propTypes = {
  place: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function BillingInformation({ places, selectedPlaceId, onSelectPlace }) {
  return (
    <Card
      component="section"
      aria-labelledby="monitoring-map-title"
      sx={{
        height: "100%",
        overflow: "hidden",
        border: "1px solid rgba(52, 71, 103, 0.08)",
        boxShadow: "0 8px 28px rgba(15, 65, 81, 0.08)",
      }}
    >
      <MDBox
        display="flex"
        alignItems="center"
        px={{ xs: 2, sm: 2.5 }}
        py={2}
        sx={{ borderBottom: "1px solid rgba(52, 71, 103, 0.08)" }}
      >
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
          <Icon>location_on</Icon>
        </MDBox>
        <MDBox>
          <MDTypography id="monitoring-map-title" component="h2" variant="h6" fontWeight="bold">
            Mapa de monitoreo
          </MDTypography>
          <MDTypography variant="caption" color="text">
            Seleccione un lugar para consultar sus sensores de temperatura.
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox sx={{ p: { xs: 1, sm: 1.5 }, backgroundColor: "#F8FAFB" }}>
        <MDBox
          role="region"
          aria-label="Mapa de lugares con sensores de temperatura"
          sx={{
            height: { xs: "52vh", md: "60vh" },
            minHeight: { xs: 380, md: 440 },
            width: "100%",
            overflow: "hidden",
            borderRadius: "0.75rem",
            border: "1px solid rgba(0, 145, 179, 0.12)",
          }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyAXYEy8A4QGBYCQTIFB4JN3rQZkI1ybhW0" }}
            defaultCenter={defaultMapPosition.center}
            defaultZoom={defaultMapPosition.zoom}
          >
            {places.map((place) => (
              <PlaceMarker
                key={place.id}
                lat={place.position.lat}
                lng={place.position.lng}
                place={place}
                isSelected={place.id === selectedPlaceId}
                onSelect={onSelectPlace}
              />
            ))}
          </GoogleMapReact>
        </MDBox>
      </MDBox>
    </Card>
  );
}

BillingInformation.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      position: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
  selectedPlaceId: PropTypes.string.isRequired,
  onSelectPlace: PropTypes.func.isRequired,
};

export default BillingInformation;
