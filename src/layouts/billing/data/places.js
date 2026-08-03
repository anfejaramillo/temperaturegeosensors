const places = [
  {
    id: "gasolinera-el-lujo",
    name: "Gasolinera El Lujo",
    position: { lat: 4.823684357652209, lng: -75.68569143446105 },
    sensors: [
      {
        id: "tanque-gasolina",
        name: "Sensor del tanque de gasolina",
        currentTemperature: 18.4,
        minTemperature: 15,
        maxTemperature: 25,
      },
      {
        id: "surtidor-diesel",
        name: "Sensor del surtidor diésel",
        currentTemperature: 27.8,
        minTemperature: 15,
        maxTemperature: 25,
      },
    ],
  },
  {
    id: "transporte-alimentos-la-vaca",
    name: "Transporte de Alimentos La Vaca",
    position: { lat: 4.806920919644718, lng: -75.72371442527306 },
    sensors: [
      {
        id: "camara-refrigerada",
        name: "Sensor de la cámara refrigerada",
        currentTemperature: 4.2,
        minTemperature: 2,
        maxTemperature: 8,
      },
      {
        id: "congelador-carga",
        name: "Sensor del congelador de carga",
        currentTemperature: -15.6,
        minTemperature: -20,
        maxTemperature: -18,
      },
      {
        id: "cabina-termica",
        name: "Sensor de la cabina térmica",
        currentTemperature: 6.8,
        minTemperature: 2,
        maxTemperature: 8,
      },
    ],
  },
  {
    id: "restaurante-el-camello",
    name: "Restaurante El Camello",
    position: { lat: 4.79657185650471, lng: -75.70508916792271 },
    sensors: [
      {
        id: "refrigerador-cocina",
        name: "Sensor del refrigerador de cocina",
        currentTemperature: 5.1,
        minTemperature: 2,
        maxTemperature: 8,
      },
      {
        id: "congelador-principal",
        name: "Sensor del congelador principal",
        currentTemperature: -19.2,
        minTemperature: -22,
        maxTemperature: -18,
      },
      {
        id: "vitrina-fria",
        name: "Sensor de la vitrina fría",
        currentTemperature: 10.4,
        minTemperature: 2,
        maxTemperature: 8,
      },
    ],
  },
  {
    id: "supermercado-el-duro",
    name: "Supermercado El Duro",
    position: { lat: 4.812736853098565, lng: -75.68277319137388 },
    sensors: [
      {
        id: "zona-lacteos",
        name: "Sensor de la zona de lácteos",
        currentTemperature: 4.8,
        minTemperature: 2,
        maxTemperature: 6,
      },
      {
        id: "vitrina-carnes",
        name: "Sensor de la vitrina de carnes",
        currentTemperature: 7.3,
        minTemperature: 0,
        maxTemperature: 4,
      },
      {
        id: "isla-congelados",
        name: "Sensor de la isla de congelados",
        currentTemperature: -18,
        minTemperature: -22,
        maxTemperature: -18,
      },
    ],
  },
  {
    id: "transporte-super-rapido",
    name: "Transporte Súper Rápido",
    position: { lat: 4.818039572634685, lng: -75.71350057446803 },
    sensors: [
      {
        id: "bodega-movil",
        name: "Sensor de la bodega móvil",
        currentTemperature: 7.9,
        minTemperature: 2,
        maxTemperature: 8,
      },
      {
        id: "puerta-trasera",
        name: "Sensor de la puerta trasera",
        currentTemperature: 8.6,
        minTemperature: 2,
        maxTemperature: 8,
      },
    ],
  },
  {
    id: "estacion-servicio-gran-descuento",
    name: "Estación de Servicio Gran Descuento",
    position: { lat: 4.820092227158473, lng: -75.6987376976742 },
    sensors: [
      {
        id: "deposito-lubricantes",
        name: "Sensor del depósito de lubricantes",
        currentTemperature: 23.6,
        minTemperature: 15,
        maxTemperature: 30,
      },
      {
        id: "cuarto-tecnico",
        name: "Sensor del cuarto técnico",
        currentTemperature: 31.2,
        minTemperature: 18,
        maxTemperature: 28,
      },
    ],
  },
  {
    id: "venta-consumo-detal",
    name: "Venta y Consumo al Detal",
    position: { lat: 4.804269521738334, lng: -75.68860967754819 },
    sensors: [
      {
        id: "nevera-bebidas",
        name: "Sensor de la nevera de bebidas",
        currentTemperature: 5.7,
        minTemperature: 2,
        maxTemperature: 8,
      },
      {
        id: "exhibidor-refrigerado",
        name: "Sensor del exhibidor refrigerado",
        currentTemperature: 8,
        minTemperature: 2,
        maxTemperature: 8,
      },
    ],
  },
];

export default places;
