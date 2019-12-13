import React from "react";
import { Marker, CircleMarker } from "react-leaflet";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import BaseMap from ".";
import SelectVehicles from "../mocks/SelectVehicles";
import AllVehiclesOverlay from "../mocks/AllVehicles";

import "../assets/map.css";

export default {
  title: "Map",
  decorators: [withInfo]
};

const mapConfig = {
  baseLayers: [
    {
      name: "Streets",
      url:
        "//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png",
      subdomains: "abcd",
      attribution:
        'Map tiles: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
      hasRetinaSupport: true
    },
    {
      name: "Stamen Toner Lite",
      url: "http://tile.stamen.com/toner-lite/%7Bz%7D/%7Bx%7D/%7By%7D.png",
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }
  ],
  initLat: 33.758189,
  initLon: -84.38361,
  initZoom: 13
};

const center = [mapConfig.initLat, mapConfig.initLon];

const sampleMarkers = (
  <CircleMarker center={center} radius={100} interactive={false}>
    <Marker position={center} />
  </CircleMarker>
);

const samplePopup = (
  <div>
    <h1>Popup Title</h1>
    <p>
      Sample <span style={{ color: "purple" }}>popup</span> content.
    </p>
  </div>
);

const onClick = action("onClick");
const onPopupClosed = action("onPopupClosed");
const onOverlayAdded = action("onOverlayAdded");
const onOverlayRemoved = action("onOverlayRemoved");
const onViewportChanged = action("onViewportChanged");

export const noProps = () => <BaseMap />;

export const withSampleMarkers = () => (
  <BaseMap mapConfig={mapConfig}>{sampleMarkers}</BaseMap>
);

export const withTwoOverlaysFromTrimetTransitComponents = () => (
  <div>
    <div>
      Click the layers button to toggle layers. Check actions log for overlay
      events.
    </div>
    <BaseMap
      mapConfig={mapConfig}
      onOverlayAdded={onOverlayAdded}
      onOverlayRemoved={onOverlayRemoved}
    >
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" visible />
    </BaseMap>
  </div>
);

export const withOverlaysOverlappingOtherMarkers = () => (
  <div>
    <div>
      You should be able to see the tooltip and interact with the dots inside
      the blue circle.
    </div>
    <BaseMap
      mapConfig={mapConfig}
      onOverlayAdded={onOverlayAdded}
      onOverlayRemoved={onOverlayRemoved}
    >
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" visible />
      {sampleMarkers}
    </BaseMap>
  </div>
);

export const customLocationPopupContent = () => (
  <BaseMap
    mapConfig={mapConfig}
    popupLocation={center}
    popupContent={samplePopup}
    onPopupClosed={onPopupClosed}
  />
);

export const customLocationPopupNoContent = () => (
  <BaseMap mapConfig={mapConfig} popupLocation={center} />
);

export const customPopupContentNoLocation = () => (
  <BaseMap mapConfig={mapConfig} popupContent={samplePopup} />
);

export const clickAndViewportchangedEvents = () => (
  <BaseMap
    mapConfig={mapConfig}
    onClick={onClick}
    onViewportChanged={onViewportChanged}
  ></BaseMap>
);