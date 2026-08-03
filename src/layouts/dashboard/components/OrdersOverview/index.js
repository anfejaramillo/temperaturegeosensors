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

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Resumen de pedidos
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            este mes
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="$2400, cambios de diseño"
          dateTime="22 DIC, 7:20 p. m."
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="Nuevo pedido #1832412"
          dateTime="21 DIC, 11:00 p. m."
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Pagos del servidor de abril"
          dateTime="21 DIC, 9:34 p. m."
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="Nueva tarjeta añadida al pedido #4395133"
          dateTime="20 DIC, 2:20 a. m."
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="Nueva tarjeta añadida al pedido #4395133"
          dateTime="18 DIC, 4:54 a. m."
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
