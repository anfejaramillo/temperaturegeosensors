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

// Vistas principales
import Home from "layouts/home";
import Billing from "layouts/billing";
import TemperatureHistory from "layouts/temperature-history";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Inicio",
    key: "inicio",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/inicio",
    component: <Home />,
  },
  {
    type: "collapse",
    name: "Monitoreo de Temperatura",
    key: "billing",
    icon: <Icon fontSize="small">device_thermostat</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Histórico de temperaturas",
    key: "historial",
    icon: <Icon fontSize="small">history</Icon>,
    route: "/historial",
    component: <TemperatureHistory />,
  },
];

export default routes;
