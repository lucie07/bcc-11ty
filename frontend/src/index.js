/*jshint esversion: 8 */

import { StoryMap } from "./storymap.js";

//Custom Canvas Renderer);

// Rough tests whether line is east-west or west-east for purposes of text orintation
/*function testDirection(geom) {
  var orientation;
  if (
    geom.geometry.coordinates[0][0][0] >
    geom.geometry.coordinates[0][geom.geometry.coordinates[0].length - 1][0]
  ) {
    orientation = 180;
    return orientation;
  } else {
    orientation = 0;
    return orientation;
  }
}*/

/* eslint-disable */

let storyMap = new StoryMap(storyURIs, L, d3);
storyMap.initMap(startLat, startLng, startZoom);
//return storyMap;

/* eslint-enable */
