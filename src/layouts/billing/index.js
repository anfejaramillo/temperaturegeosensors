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

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

// Shared institutional layout components
import InstitutionalHeader from "layouts/components/InstitutionalHeader";

// Billing page components and data
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import places from "layouts/billing/data/places";

function Billing() {
  const [selectedPlaceId, setSelectedPlaceId] = useState(places[0].id);
  const selectedPlace = places.find(({ id }) => id === selectedPlaceId) || places[0];

  return (
    <DashboardLayout>
      <MDBox mt={{ xs: 7, xl: 0 }} mb={3} mx={{ xs: 0, sm: 1 }}>
        <InstitutionalHeader
          badge="Datos de demostración"
          badgeIcon="thermostat"
          title="Monitoreo de Temperatura INVIMA"
          description="Seguimiento georreferenciado de sensores para consultar temperaturas, rangos permitidos y alertas por establecimiento."
        />
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <BillingInformation
              places={places}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={setSelectedPlaceId}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Transactions place={selectedPlace} />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
