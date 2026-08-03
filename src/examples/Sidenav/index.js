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

import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const isDesktop = useMediaQuery("(min-width:1200px)");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => {
    if (!isDesktop) setMiniSidenav(dispatch, true);
  };

  useEffect(() => {
    setMiniSidenav(dispatch, !isDesktop);

    if (!isDesktop) {
      setTransparentSidenav(dispatch, false);
      setWhiteSidenav(dispatch, false);
    }
  }, [dispatch, isDesktop]);

  useEffect(() => {
    if (!isDesktop) setMiniSidenav(dispatch, true);
  }, [dispatch, isDesktop, location.pathname]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          onClick={closeSidenav}
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route} onClick={closeSidenav}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      id="main-sidenav"
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop || !miniSidenav}
      onClose={closeSidenav}
      ModalProps={{ keepMounted: true }}
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={2.5} pb={2} px={miniSidenav ? 2 : 2.5} textAlign="center">
        <IconButton
          aria-label="Cerrar menú de navegación"
          size="small"
          onClick={closeSidenav}
          sx={{
            display: { xs: "inline-flex", xl: "none" },
            position: "absolute",
            top: 8,
            right: 8,
            color: "#FFFFFF",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            "&.Mui-focusVisible": { outline: "3px solid #FFFFFF", outlineOffset: 2 },
          }}
        >
          <Icon sx={{ fontWeight: "bold" }}>close</Icon>
        </IconButton>
        <MDBox
          component={NavLink}
          to="/inicio"
          onClick={closeSidenav}
          aria-label={`Ir al inicio de ${brandName}`}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          sx={{ textDecoration: "none" }}
        >
          {brand && (
            <MDBox
              component="img"
              src={brand}
              alt="Logotipo oficial de INVIMA"
              sx={(theme) => ({
                display: "block",
                width: miniSidenav ? 0 : "11.5rem",
                maxWidth: "100%",
                height: miniSidenav ? 0 : "3.5rem",
                objectFit: "contain",
                opacity: miniSidenav ? 0 : 1,
                visibility: miniSidenav ? "hidden" : "visible",
                transition: theme.transitions.create(["width", "height", "opacity"], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
              })}
            />
          )}
          <MDBox
            width={miniSidenav ? 0 : "100%"}
            mt={brand ? 1 : 0}
            px={miniSidenav ? 0 : 0.5}
            sx={(theme) => ({
              ...sidenavLogoLabel(theme, { miniSidenav }),
              marginLeft: 0,
              maxWidth: "100%",
              overflow: "hidden",
            })}
          >
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={textColor}
              sx={{ lineHeight: 1.3, whiteSpace: "normal", overflowWrap: "break-word" }}
            >
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
