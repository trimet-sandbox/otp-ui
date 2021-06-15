import BaseMap from "@opentripplanner/base-map";
import {
  stationType,
  vehicleRentalMapOverlaySymbolsType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { CircleMarker } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import VehicleRentalOverlay from ".";
import bikeRentalStations from "../__mocks__/bike-rental-stations.json";
import carRentalStations from "../__mocks__/car-rental-stations.json";
import eScooterStations from "../__mocks__/e-scooter-rental-stations.json";
import allScooters from "../__mocks__/e-scooters-all.json";

import { HubAndFloatingBike } from "./DefaultMarkers";

import "../../../node_modules/leaflet/dist/leaflet.css";

const center = [45.518092, -122.671202];

/**
 * Creates an example Circle component to render entities
 * using a fixed size, fill color, and stroke color.
 */
const MyCircle = ({ fillColor = "gray", pixels, strokeColor }) => {
  const newStrokeColor = strokeColor || fillColor;

  const GeneratedCircle = ({ children, entity: station }) => (
    <CircleMarker
      center={[station.y, station.x]}
      color={newStrokeColor}
      fillColor={fillColor}
      fillOpacity={1}
      radius={pixels}
      weight={1}
    >
      {children}
    </CircleMarker>
  );
  GeneratedCircle.propTypes = {
    children: PropTypes.node,
    entity: stationType.isRequired
  };
  GeneratedCircle.defaultProps = {
    children: null
  };
  return GeneratedCircle;
};

const bikeMapSymbols = [
  {
    dockStrokeColor: "#000000",
    fillColor: "#FF2E28",
    minZoom: 0,
    pixels: 4,
    type: "circle"
  },
  {
    dockStrokeColor: "#000000",
    fillColor: "#FF2E28",
    minZoom: 14,
    pixels: 6,
    type: "circle"
  },
  {
    minZoom: 18,
    type: "hubAndFloatingBike"
  }
];
// Bike symbols using new symbols prop.
const bikeSymbols = [
  {
    getType: station => (station.isFloatingBike ? "floatingBike" : "dock"),
    minZoom: 0,
    symbol: MyCircle({ fillColor: "#FF2E28", pixels: 3 }),
    symbolByType: {
      dock: MyCircle({
        fillColor: "#FF2E28",
        pixels: 4,
        strokeColor: "#000000"
      })
    }
  },
  {
    getType: station => (station.isFloatingBike ? "floatingBike" : "dock"),
    minZoom: 14,
    symbol: MyCircle({ fillColor: "#FF2E28", pixels: 5 }),
    symbolByType: {
      dock: MyCircle({
        fillColor: "#FF2E28",
        pixels: 6,
        strokeColor: "#000000"
      })
    }
  },
  {
    minZoom: 18,
    symbol: HubAndFloatingBike
  }
];
const carMapSymbols = [
  {
    fillColor: "#009cde",
    minZoom: 0,
    pixels: 4,
    type: "circle"
  },
  {
    fillColor: "#009cde",
    minZoom: 14,
    pixels: 6,
    type: "circle"
  },
  {
    fillColor: "#009cde",
    minZoom: 18,
    type: "marker"
  }
];
const configCompanies = [
  {
    id: "BIKETOWN",
    label: "Biketown",
    modes: "BICYCLE_RENT"
  },
  {
    id: "CAR2GO",
    label: "car2go",
    modes: "CAR_RENT"
  },
  {
    id: "RAZOR",
    label: "Razor",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "SHARED",
    label: "Shared",
    modes: "MICROMOBILITY_RENT"
  }
];
const EScooterMapSymbols = [
  {
    fillColor: "#F80600",
    minZoom: 0,
    pixels: 4,
    strokeColor: "#CCCCCC",
    type: "circle"
  },
  // You can combine predefined symbols (type = "<type>")
  // and external symbols (symbol = Component<({ entity, zoom })>.
  // (the color and pixel properties are ignored if you use the symbol syntax.).
  {
    minZoom: 14,
    symbol: MyCircle({
      fillColor: "#F80600",
      pixels: 6,
      strokeColor: "#CCCCCC"
    })
  },
  {
    fillColor: "#F80600",
    minZoom: 18,
    type: "marker"
  }
];
const setLocation = action("setLocation");

class ZoomControlledMapWithVehicleRentalOverlay extends Component {
  constructor() {
    super();
    this.state = { zoom: 13 };
  }

  onViewportChanged = ({ zoom }) => {
    const { zoom: stateZoom } = this.state;
    if (zoom !== stateZoom) {
      this.setState({ zoom });
    }
  };

  render() {
    const {
      companies,
      getStationName,
      mapSymbols,
      refreshVehicles,
      stations
    } = this.props;
    const { zoom } = this.state;
    return (
      <BaseMap
        center={center}
        onViewportChanged={this.onViewportChanged}
        zoom={zoom}
      >
        <VehicleRentalOverlay
          configCompanies={configCompanies}
          companies={companies}
          getStationName={getStationName}
          setLocation={setLocation}
          mapSymbols={mapSymbols}
          refreshVehicles={refreshVehicles}
          stations={stations}
          visible
          zoom={zoom}
        />
      </BaseMap>
    );
  }
}

ZoomControlledMapWithVehicleRentalOverlay.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.string.isRequired),
  getStationName: PropTypes.func,
  mapSymbols: vehicleRentalMapOverlaySymbolsType,
  refreshVehicles: PropTypes.func.isRequired,
  stations: PropTypes.arrayOf(stationType.isRequired).isRequired
};

ZoomControlledMapWithVehicleRentalOverlay.defaultProps = {
  companies: null,
  getStationName: undefined,
  mapSymbols: null
};

function customStationName(_, station) {
  return `🛴 (ID: ${station.id})`;
}

storiesOf("VehicleRentalOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("VehicleRentalOverlay with rental bicycles", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["BIKETOWN"]}
      mapSymbols={bikeMapSymbols}
      refreshVehicles={action("refresh bicycles")}
      stations={bikeRentalStations}
    />
  ))
  .add(
    "VehicleRentalOverlay with rental bicycles using new symbols prop",
    () => (
      <ZoomControlledMapWithVehicleRentalOverlay
        companies={["BIKETOWN"]}
        refreshVehicles={action("refresh bicycles")}
        mapSymbols={bikeSymbols}
        stations={bikeRentalStations}
      />
    )
  )
  .add("VehicleRentalOverlay with rental cars", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["CAR2GO"]}
      mapSymbols={carMapSymbols}
      refreshVehicles={action("refresh cars")}
      stations={carRentalStations}
    />
  ))
  .add("VehicleRentalOverlay with rental E-scooters", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["SHARED"]}
      mapSymbols={EScooterMapSymbols}
      refreshVehicles={action("refresh E-scooters")}
      stations={eScooterStations}
    />
  ))
  .add("VehicleRentalOverlay with rental E-scooters with custom naming", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      companies={["SHARED"]}
      getStationName={customStationName}
      mapSymbols={EScooterMapSymbols}
      refreshVehicles={action("refresh E-scooters")}
      stations={eScooterStations}
    />
  ))
  .add("VehicleRentalOverlay with *ALL* rental e-scooters", () => (
    <ZoomControlledMapWithVehicleRentalOverlay
      mapSymbols={EScooterMapSymbols}
      refreshVehicles={action("refresh E-scooters")}
      stations={allScooters}
    />
  ));
