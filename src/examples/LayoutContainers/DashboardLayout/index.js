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
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 2 React context
import { useMaterialUIController, setLayout, setMiniSidenav } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: { xs: 1.5, sm: 2, xl: 3 },
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <IconButton
        type="button"
        aria-label="Abrir menú de navegación"
        aria-controls="main-sidenav"
        aria-expanded={!miniSidenav}
        onClick={() => setMiniSidenav(dispatch, false)}
        sx={(theme) => ({
          display: { xs: miniSidenav ? "inline-flex" : "none", xl: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: theme.zIndex.drawer + 1,
          width: 44,
          height: 44,
          color: "#FFFFFF",
          backgroundColor: "#006D87",
          boxShadow: "0 5px 16px rgba(0, 47, 59, 0.28)",
          "&:hover": { backgroundColor: "#004C60" },
          "&.Mui-focusVisible": {
            outline: "3px solid #FFFFFF",
            boxShadow: "0 0 0 6px #002F3B",
          },
        })}
      >
        <Icon>menu</Icon>
      </IconButton>
      {children}
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
