/*jshint esversion: 8 */

/*import L from 'leaflet';
import 'leaflet-dvf';
import 'leaflet-textpath';*/

// https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity



let geojson_uri = [];
let shapeLayers = null;
let shapesByFrameLink = {};

//Custom Canvas Renderer);

// Rough tests whether line is east-west or west-east for purposes of text orintation
function testDirection(geom) {
    var orientation;
    if (geom.geometry.coordinates[0][0][0] > geom.geometry.coordinates[0][(geom.geometry.coordinates[0].length - 1)][0]) {
        orientation = 180;
        return orientation;
    } else {
        orientation = 0;
        return orientation;
    }
}

function loadStoryMap(storyuris) {
    let storyMap = new StoryMap(
        storyuris
    );
    return storyMap;
}

let storyMap = new StoryMap(
    storyURIs
);

storyMap.initMap(L, startLat, startLng, startZoom);




