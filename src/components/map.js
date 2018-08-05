import {withGoogleMap, GoogleMap } from "react-google-maps";
import React from 'react';

const Map = withGoogleMap((props) =>
  <GoogleMap defaultZoom={props.zoom} defaultCenter={props.coordinates}>
  </GoogleMap>
)

export default Map;