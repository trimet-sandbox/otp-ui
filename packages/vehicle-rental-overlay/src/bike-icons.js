import { divIcon } from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";

import * as Styled from "./styled";

export const floatingBikeIcon = divIcon({
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -12],
  html: ReactDOMServer.renderToStaticMarkup(<Styled.OutOfHubBikeIcon />),
  className: ""
});

export const hubIcons = Styled.hubIcons.map(StyledIcon =>
  divIcon({
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -12],
    html: ReactDOMServer.renderToStaticMarkup(<StyledIcon />),
    className: ""
  })
);
