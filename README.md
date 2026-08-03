# Monitoreo de Temperatura INVIMA

Aplicación demostrativa en español para consultar lugares, sensores y el estado de sus rangos de temperatura. La página principal se publica en `/inicio`; la vista operativa en `/billing` permite seleccionar un lugar en el mapa para actualizar su listado de sensores, y `/historial` permite revisar dos días de lecturas por minuto, límites permitidos y periodos sin comunicación.

La ruta raíz `/` y las direcciones desconocidas redirigen a `/inicio`.

## Base técnica

- React 18.2.0
- Material UI 5.12.3
- React Router 6.11.0
- Google Map React 2.2.1
- React Scripts 5.0.1

## Desarrollo local

```bash
npm start
```

## Validación de producción

```bash
npm run build
```

## Regenerar los datos históricos

El histórico se carga desde `public/data/temperature-history.json`. Para regenerar su contenido determinista:

```bash
npm run generate:history
```

## Identidad institucional

Los recursos oficiales utilizados por la interfaz se conservan sin alterar en `src/assets/images/institutional`. Su procedencia y autorización están documentadas en el archivo README de esa carpeta.

La licencia y los avisos de atribución de Material Dashboard 2 React se mantienen en `LICENSE.md` y en los encabezados correspondientes del código fuente.
