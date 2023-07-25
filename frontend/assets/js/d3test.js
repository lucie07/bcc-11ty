/*jshint esversion: 6 */

/*import L from 'leaflet';
import 'leaflet-dvf';
import 'leaflet-textpath';*/

// https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity

class StoryMap {
    constructor(storyUris) {
        this.overlay = null;
        // Data parameters
        this.storyUris = storyUris;
        this.map = null;
        this.layerGroups = {};
        this.storyFrames = [];

        // Map parameters
        this.mapMinZoom = 1;
        this.mapMaxZoom = 11;

        this.slideElementTagName = 'article';
        this.topSlideElement = null;

        // Styles for Features
        // fillColor: '#ff7800', fill: true
        this.highlightLineStyle = {
            stroke: true,
            color: '#0000ff',
            weight: 5,
            opacity: 1
        };

        // color: 'rgba(0,0,0,0)',
        this.defaultLineStyle = {
            stroke: true,
            color: '#ff0000',
            fillColor: '#ff0000',
            weight: 2,
            opacity: 0.6,
            fill: true
        };

        // Slides for map features with include
        // rules, features, and frame
        this.slides = {};
        this.lastSlideDisplayed = null;

        // <article elements> on page
        this.slideElements = {};

        this.allFeatures = [];
        this.allFeaturesLayer = null;

        // Text features (e.g.) rivers info stored hers
        // So it can be added/changed by zoom
        this.textFeatures = {};
        this.textMinZoomLevel = 8;
        this.defaultTextAttributes = {
            'fill': 'black',
            'font-family': 'EB Garamond, serif',
            'font-weight': 'bold',

            //'textLength': 300,
            //'lengthAdjust': 'spacing',
            'dx': '15%',
        };

    }

    async loadShapeFile(shape_url) {
        let response = await fetch(shape_url);
        let json = await response.json();
        return json;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async loadD3() {
        /*Setup overlar pane as d3 */
        L.svg({clickable: true}).addTo(this.map);
        const overlay = d3.select(storyMap.map.getPanes().overlayPane);
        //overlay.style.zIndex = "650";


        this.svg = overlay.select('svg').attr("pointer-events", "auto");

        /* Line generators that will work with features */
        this.multipolygonToPath = d3.line()
            .x((d) => this.map.latLngToLayerPoint([d[1], d[0]]).x)
            .y((d) => this.map.latLngToLayerPoint([d[1], d[0]]).y);



        return true;
        //console.log(svg);

        // This part will be done by slide
        //storyMap.getSlideById("slide_5")
        /* let td = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"Name":"Vancouver"},"geometry":{"type":"Point","coordinates":[-122.34374999999999,49.32512199104001]}},{"type":"Feature","properties":{"Name":"Calgary"},"geometry":{"type":"Point","coordinates":[-114.08203125,51.09662294502995]}},{"type":"Feature","properties":{"Name":"Edmonton"},"geometry":{"type":"Point","coordinates":[-113.51074218749999,53.56641415275043]}},{"type":"Feature","properties":{"Name":"Prince George"},"geometry":{"type":"Point","coordinates":[-122.78320312499999,53.93021986394]}},{"type":"Feature","properties":{"Name":"Fort St. John"},"geometry":{"type":"Point","coordinates":[-120.80566406250001,56.24334992410525]}},{"type":"Feature","properties":{"Name":"Prince Rupert"},"geometry":{"type":"Point","coordinates":[-130.3857421875,54.34214886448341]}},{"type":"Feature","properties":{"Name":"Fort McMurray"},"geometry":{"type":"Point","coordinates":[-111.26953125,56.65622649350222]}}]}
         this.map.fitBounds(L.geoJson(pointsTest).getBounds());
         console.log(pointsFile.features);
         const Dots = svg.selectAll('circle')
             .attr("class", "Dots")
             .data(pointsTest.features)
             .join('circle')
                 .attr("id", "dotties")
                 .attr("fill", "steelblue")
                 .attr("stroke", "black")
                 //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                 //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                 //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                 .attr("cx", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x)
                 .attr("cy", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y)
                 .attr("r", 5)
                 .on('mouseover', function () { //function to add mouseover event
                     d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                         .duration('150') //how long we are transitioning between the two states (works like keyframes)
                         .attr("fill", "red") //change the fill
                         .attr('r', 10); //change radius
                 })
                 .on('mouseout', function () { //reverse the action based on when we mouse off the the circle
                     d3.select(this).transition()
                         .duration('150')
                         .attr("fill", "steelblue")
                         .attr('r', 5);
                 });

         await svg.selectAll('circle')
             .transition()
             .delay(function(d, i){
                 return i* 150;
             })
             .attr('r', 10)
             .on('end', function(){

             });
         console.log('done');


         const update = () => Dots
             .attr("cx", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x)
             .attr("cy", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y);


         this.map.on("zoomend", update);
         return svg.node();*/
    }

    async drawHomelandsIntro() {

        this.svg.selectAll('.homelands')
            .data(this.pointsFile.features)
            .join("path")
            .attr('class', 'homelands')
            .attr('title', d => d.properties.norm_text)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", "0")
            .attr("d", d => this.multipolygonToPath(d.geometry.coordinates[0][0]));

        this.svg
            .selectAll(".homelands") // <-- now we can select the paths and get the bbox
            .each((d, i, nodes) => {
                // https://stackoverflow.com/questions/74358276/add-title-text-to-the-center-of-path-in-d3
                const bbox = d3.select(nodes[i]).node().getBBox();
                const centreX = bbox.x + (bbox.width / 2); // <-- get x centre
                const centreY = bbox.y + (bbox.height / 2);
                this.svg
                    .append("text") // <-- now add the text element
                    .text(d.properties.norm_text)
                    .attr("x", centreX)
                    .attr("y", centreY)
                    .attr("fill", "#0804ee")
                    .attr("text-anchor", "middle");
            });
        /*
        this.svg.selectAll('.homelandsText')
            .data(this.pointsFile.features)
            .join("text")
            .text(d => d.properties.norm_text)
            .attr('class', 'homeText')

            .attr("text-anchor", "middle");
            */
        /*this.svg.selectAll('.homelands')
            .data(this.pointsFile.features)
            .join("text")
                .attr('class', 'homelands')
                .attr("stroke", "black")
                .attr("fill", "none")
                .attr("stroke-width", "1")
                .attr("d", d => lg(d.geometry.coordinates[0][0]));*/


    }

    /** Animated intro for the homelands section in D3*/
    async playHomelandsIntro() {

        this.pointsFile = await this.loadShapeFile(this.storyUris.homelands);

        let coordinates = this.pointsFile.features[0].geometry.coordinates[0][0];

        let points = [];
        for (let i = 0; i < coordinates.length; i++) {
            let point = this.map.latLngToLayerPoint([coordinates[i][1], coordinates[i][0]]);
            points.push(point);
        }
        //this.drawHomelandsIntro();
        this.map.on("zoomend", function () {
            this.drawHomelandsIntro();
        }, this);

        this.map.on('moveend', this.drawHomelandsIntro());

        let bounds = this.map.flyToBounds(this.getStoryFrameBounds(10));


        /*console.log(points);
        this.svg.selectAll('path')
            .attr("class", "testLine")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr("d", lg(points));*/
        console.log(coordinates);
        //this.map.fitBounds(L.geoJson(pointsFile).getBounds());
        /*const Dots = this.svg.selectAll('circle')
            .attr("class", "Dots")
            .data(coordinates)
            .join('circle')
            .attr("id", "dotties")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr("cx", d => this.map.latLngToLayerPoint([d[1], d[0]]).x)
            .attr("cy", d => this.map.latLngToLayerPoint([d[1], d[0]]).y)
            .attr("r", 5);

        const update = () => Dots
            .attr("cx", d => this.map.latLngToLayerPoint([d[1], d[0]]).x)
            .attr("cy", d => this.map.latLngToLayerPoint([d[1], d[0]]).y);*/

        //this.map.on("zoomend", update);


        /*this.svg.selectAll('circle')
            .attr("class", "Dots")
            .data(coordinates)
            .join('circle')
                .attr("id", "dotties")
                .attr("fill", "steelblue")
                .attr("stroke", "black")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", 5);*/
        /*
        this.svg.select("path")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr('d', lg(points));
*/
        /*this.svg.selectAll("path")
             .data(coordinates)


        /*const Dots = this.svg.selectAll('circle')
            .attr("class", "Dots")
            .data(pointsFile.features)
            .join('circle')
                .attr("id", "dotties")
                .attr("fill", "steelblue")
                .attr("stroke", "black")
                //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                .attr("cx", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x)
                .attr("cy", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y)
                .attr("r", 5);*/


    }

    async playPathways1Intro() {
        let bounds = this.map.flyToBounds(this.getStoryFrameBounds(10));
        await this.sleep(1000);

        let pathwaysFile = await this.loadShapeFile(this.storyUris.pathways1);
        console.log(pathwaysFile);
        // .attr('title', d => d.properties.norm_text)

          let riverPoints = {
  "type": "FeatureCollection",
  "name": "BCC_riverPoints",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "id": 55008, "feat_type": 1, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Alleguippes", "norm_text": "Alleguippes", "accuracy": 3, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -79.787050908727593, 40.368005421909643 ] } },
{ "type": "Feature", "properties": { "id": 50522, "feat_type": 1, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Senekaas", "norm_text": "Senekaas", "accuracy": null, "story_link": 1, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -79.894974320999168, 40.566423669925982 ] } },
{ "type": "Feature", "properties": { "id": 50521, "feat_type": 1, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Buffalo T.", "norm_text": "Buffalo Town", "accuracy": null, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -79.769007127512225, 40.738706008860092 ] } },
{ "type": "Feature", "properties": { "id": 51238, "feat_type": 5, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Allegheny pr Old Shenpeye T. Kingl Settle pg", "norm_text": "Allegheny pr Old Shenpeye T. Kingl Settle pg", "accuracy": null, "story_link": null, "frame_link": null, "identity": 1 }, "geometry": { "type": "Point", "coordinates": [ -79.580484797123603, 40.703635509536312 ] } },
{ "type": "Feature", "properties": { "id": 50523, "feat_type": 1, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Shanioning", "norm_text": "Shanioning", "accuracy": null, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -79.852128336819945, 40.524749186199799 ] } },
{ "type": "Feature", "properties": { "id": 51225, "feat_type": 5, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Ft du Oraock", "norm_text": "Fort du Oraock", "accuracy": null, "story_link": null, "frame_link": null, "identity": 1 }, "geometry": { "type": "Point", "coordinates": [ -79.968669413787467, 40.436757051020692 ] } },
{ "type": "Feature", "properties": { "id": 3747, "feat_type": 4, "sub_type": 8, "map_source": 12, "date_yr": 1755, "map_text": "Carehannon", "norm_text": "Carehannon", "accuracy": null, "story_link": null, "frame_link": null, "identity": null }, "geometry": { "type": "Point", "coordinates": [ -79.548778768830957, 40.987563087530106 ] } },
{ "type": "Feature", "properties": { "id": 50519, "feat_type": 1, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Sillauringo", "norm_text": "Sillauringo", "accuracy": null, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -79.676888261526884, 40.788357581940033 ] } },
{ "type": "Feature", "properties": { "id": 52949, "feat_type": 1, "sub_type": 10, "map_source": 9, "date_yr": 1754, "map_text": "CAPE CHARLES", "norm_text": "Cape Charles", "accuracy": null, "story_link": null, "frame_link": null, "identity": 1 }, "geometry": { "type": "Point", "coordinates": [ -75.965140652079782, 37.148044894716968 ] } },
{ "type": "Feature", "properties": { "id": 3751, "feat_type": 3, "sub_type": 8, "map_source": 12, "date_yr": 1755, "map_text": "Ford", "norm_text": "Ford", "accuracy": null, "story_link": null, "frame_link": null, "identity": null }, "geometry": { "type": "Point", "coordinates": [ -79.068475286181751, 43.164588800799542 ] } },
{ "type": "Feature", "properties": { "id": 3752, "feat_type": 3, "sub_type": 8, "map_source": 12, "date_yr": 1755, "map_text": "Great fall of Niagara 140 feet", "norm_text": "Great fall of Niagara 140 feet", "accuracy": null, "story_link": null, "frame_link": null, "identity": null }, "geometry": { "type": "Point", "coordinates": [ -79.058192249978731, 43.085158423153878 ] } },
{ "type": "Feature", "properties": { "id": 51230, "feat_type": 5, "sub_type": 4, "map_source": 12, "date_yr": 1755, "map_text": "Storehouse", "norm_text": "Storehouse", "accuracy": null, "story_link": null, "frame_link": null, "identity": 1 }, "geometry": { "type": "Point", "coordinates": [ -78.963931084784392, 43.046970161425975 ] } },
{ "type": "Feature", "properties": { "id": 51331, "feat_type": 1, "sub_type": 10, "map_source": 12, "date_yr": 1755, "map_text": "Irondequat B.", "norm_text": "Irondequat Bay", "accuracy": null, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -77.207497053305062, 43.250720632216236 ] } },
{ "type": "Feature", "properties": { "id": 51701, "feat_type": 1, "sub_type": 10, "map_source": 12, "date_yr": 1755, "map_text": "Cayugaes Bay", "norm_text": "Cayugaes Bay", "accuracy": null, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -76.696626994222513, 43.386754273837653 ] } },
{ "type": "Feature", "properties": { "id": 55184, "feat_type": 1, "sub_type": 10, "map_source": 12, "date_yr": 1755, "map_text": "Ofwego Bay", "norm_text": "Oswego Bay", "accuracy": null, "story_link": null, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -76.434566848641268, 43.485642179996916 ] } },
{ "type": "Feature", "properties": { "id": 51591, "feat_type": 1, "sub_type": 10, "map_source": 12, "date_yr": 1755, "map_text": "Port Chicagou", "norm_text": "Port Chicagou", "accuracy": 3, "story_link": 1, "frame_link": null, "identity": 2 }, "geometry": { "type": "Point", "coordinates": [ -87.630933978956435, 41.85718320080619 ] } },
  ]};
          let testPoint = [
              pathwaysFile.features[0].geometry.coordinates[0][0],
          ];
        console.log(testPoint);
        // https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61
        this.svg.selectAll('.pathways')
            .data([pathwaysFile.features[0]])
            .join("path")
            .attr('class', 'pathways')
            .attr("stroke", "blue")
            .attr("fill", "none")
            .attr("stroke-width", "1.5")
            .attr("d", d => this.multipolygonToPath(d.geometry.coordinates[0]));
        const path = this.svg.select('.pathways');
        const length = path.node().getTotalLength();
        await path
            .attr("stroke-dashoffset", length)
            .attr("stroke-dasharray", length)
            .transition()
                .duration(2500)
                .attr("stroke-dashoffset", 0)
                .end();

        const settlements = this.svg.selectAll('circle')
             .attr("class", "Dots")
             .data(riverPoints.features)
             .join('circle')
                 .attr("class", "settlements")
                 .attr("fill", "steelblue")
                 .attr("stroke", "black")
                 //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                 //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                 //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                 .attr("cx", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x)
                 .attr("cy", d => this.map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y)
                 .attr("r", 2);

        await settlements
             .transition()
              .duration(500)
             .attr('r', 5)
             .end();

        await settlements
             .transition()
             .duration(500)
             .attr('r', 2)
             .end();

    }

    async playPathways2Intro() {

    }

    async playLinesIntro() {

    }

    /**
     * Load all shape files asynchronously
     */
    async loadShapes(shape_urls) {
        let shapePromises = [];
        let shapeGeoJSON = [];
        let storyFeatures = [];

        let shapeLayer = {};
        for (let u = 0; u < shape_urls.length; u++) {
            shapePromises.push(this.loadShapeFile(shape_urls[u]));
        }
        await Promise.all(shapePromises).then((values) => {
            for (let v = 0; v < values.length; v++) {
                shapeGeoJSON.push(...values[v].features);
            }
        });
        let unlinkedShapes = [];

        // Arrange into stories and default layer
        for (let s = 0; s < shapeGeoJSON.length; s++) {
            let feature = shapeGeoJSON[s];
            if (feature.properties) {
                // add to all features
                this.allFeatures.push(feature);
                //if (feature.properties.story_link === story_id) {
                storyFeatures.push(feature);
                //}
                if (feature.properties.frame_link) {
                }
                /*let frame_link = feature.properties.frame_link;
                                    if (shapesByFrameLink[frame_link]) {
                                        shapesByFrameLink[frame_link].push(feature);
                                    } else {
                                        shapesByFrameLink[frame_link] = [feature]
                                    }*/
            }
        }

        return storyFeatures;
    }

    async loadSlides() {
        if (this.storyUris && this.storyUris.slides) {
            let storySlides = await this.loadShapeFile(this.storyUris.slides);
            this.slides = storySlides.slides;
        }
    }

    getSlideById(slideid) {
        for (let s = 0; s < this.slides.length; s++) {
            if (this.slides[s].id == slideid) {
                return this.slides[s];
            }
        }
    }

    pointToLayer(feature, latlng) {
        //console.log(latlng);
        switch (feature.properties.sub_type) {
            // Indigenous : Circle - Red - point down
            case 1:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#0000ff",
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 1,
                    bubblingMouseEvents: true,
                })//.bindTooltip(feature.properties.map_text, {permanent: true, className: 'map-label'}).openTooltip()
                break;
            // Settlement : Squares - dark green - point up
            case 4:
                return new L.RegularPolygonMarker(latlng, {
                    numberOfSides: 4,
                    rotation: -45,
                    radius: 5,
                    //L.Path style options
                    fill: true,
                    fillColor: '#124d20',
                    color: '#124d20',
                    weight: 0.5,
                    fillOpacity: 1,
                    stroke: true,
                    bubblingMouseEvents: true,
                })//.bindTooltip(feature.properties.map_text, {permanent: true, className: 'map-label'}).openTooltip()
                break;
            // Land route -
            case 5:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#0000ff",
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 1,
                    bubblingMouseEvents: true,
                })
                break;
            // Sea route
            case 6:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#ffbd59",
                    color: "#ffbd59",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 0.9,
                    bubblingMouseEvents: true,
                })
                break;
            // Descriptive - white squares
            case 7:
                return new L.RegularPolygonMarker(latlng, {
                    numberOfSides: 4,
                    rotation: -45,
                    radius: 5,
                    //L.Path style options
                    fill: true,
                    fillColor: '#ffffff',
                    color: '#000000',
                    weight: 0.5,
                    fillOpacity: 1,
                    stroke: true,
                    bubblingMouseEvents: true,
                })
                break;
            //River route
            case 8:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#ff00ff",
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 1,
                    bubblingMouseEvents: true,
                })
                break;
            // Miscellaneous
            case 9:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#000000",
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 1,
                    bubblingMouseEvents: true,
                })
                break;
            // Toponym
            case 10:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#ff0000",
                    color: "#ff0000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.6,
                    bubblingMouseEvents: true,
                })//.bindTooltip(feature.properties.map_text, {permanent: true, className: 'map-label'}).openTooltip()
                break;
            default:
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#787878",
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 1,
                    bubblingMouseEvents: true,
                })
        }
    }

    initStoryFeatureLayers() {

        for (let s = 0; s < this.slides.length; s++) {
            let slide = this.slides[s];
            slide.layer = L.geoJSON(
                slide.features, {
                    // Stopping style override here
                    //style: this.defaultLineStyle,
                    pointToLayer: this.pointToLayer,
                    onEachFeature: this.onEachFeature.bind(this)
                });

        }
    }

    initAllFeaturesLayer() {

        this.allFeaturesLayer = L.geoJSON(
            this.allFeatures, {
                //style: this.defaultLineStyle,
                pointToLayer: this.pointToLayer,
                onEachFeature: this.onEachFeature.bind(this)
            });
    }

    /**
     * Get all the slide html elements and sort them by their offset top
     * So we can track user scrolling and trigger map events
     */
    getSlideElements() {
        this.slideElements = Array.from(document.getElementsByTagName(this.slideElementTagName));
        this.slideElements.sort(function (a, b) {
            if (a.offsetTop < 0) {
                return 1;
            }
            if (b.offsetTop < 0) {
                return -1;
            }
            return a.offsetTop - b.offsetTop;
        });

    }

    // Fade-in function for Leaflet
    fadeLayerLeaflet(lyr, startOpacity, finalOpacity, opacityStep, delay) {
        let opacity = startOpacity;
        let timer = setTimeout(function changeOpacity() {
            if (opacity < finalOpacity) {
                lyr.setStyle({
                    opacity: opacity,
                    fillOpacity: opacity
                });
                opacity = opacity + opacityStep
            }

            timer = setTimeout(changeOpacity, delay);
        }, delay)
    }

    /**
     * Fly the map to the slide's storyframe
     * clear existing layers
     * add this slide's layer
     *
     * @param slideid slide to display
     */
    triggerSlideMapEvents(slideid) {
        if (slideid != "explore") {

            let slide = this.getSlideById(slideid);
            if (slide) {
                // Clear layers and text
                this.clearFeatureText();
                if (slide.layer) {
                    this.storyFeatureLayerGroup.clearLayers();
                }

                // Move to bounds
                let bounds = this.map.flyToBounds(this.getStoryFrameBounds(slide.fid));

                // Add new layer once move is finished
                if (slide.layer) {
                    let slideUpdate = function () {
                        slide.layer.setStyle({
                            opacity: 0,
                            fillOpacity: 0
                        });
                        this.storyFeatureLayerGroup.addLayer(slide.layer);
                        this.fadeLayerLeaflet(slide.layer, 0, 0.8, 0.2, 0.01);
                        this.map.off('moveend', slideUpdate);
                    }.bind(this);

                    this.map.on('moveend', slideUpdate);

                }


                /*if (bounds != null) {
                    this.map.flyToBounds(this.getStoryFrameBounds(slide.fid));
                }*/
                this.lastSlideDisplayed = slide;

            }
        } else if (slideid == "explore") {

            this.storyFeatureLayerGroup.clearLayers();
            this.loadExploreLayer();
        }

    }

    async initMap(L, lat, lng, zoom) {

        this.map = L.map(
            'basemap',
            {
                scrollWheelZoom: false,
                zoomControl: false
            }
        );

        L.control.zoom({
            position: 'bottomleft'
        }).addTo(this.map);


        // Establish baselayers group
        /*this.osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);*/

        this.overlay = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom,
            attribution: "ESRI World Terrain",
            opacity: 1
        }).addTo(this.map);


        var worldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom,
            attribution: "ESRI World Terrain",
            opacity: 1
        });

        var worldStreet = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                minZoom: this.mapMinZoom,
                maxZoom: this.mapMaxZoom,
                attribution: "ESRI World Street Map",
                opacity: 1
            });


        var bcc = L.tileLayer('https://api.mapbox.com/styles/v1/neiljakeman1000/cljyd364o006701pdgs7ec6qa/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmVpbGpha2VtYW4xMDAwIiwiYSI6ImNqcGpoenBtdDA2aTczdnBmYjhsNGc5c2oifQ.vqIAnhyoZnnNeBsaNOzQGw', {
            tileSize: 512,
            zoomOffset: -1,
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom,
            attribution: "MapBox BCC",
            opacity: 1
        });


        var baseLayers = {
            "Clean Terrain": worldTerrain,
            "BCC": bcc,
            "Modern Open Street Map": worldStreet
        };

        // Create Layer Switcher

        L.control.layers(baseLayers, {}, {position: "bottomleft", collapsed: false}).addTo(this.map);

        // Initial view
        // This could be changed based on get string etc.
        this.map.setView([lat, lng], zoom);

        this.storyFeatureLayerGroup = L.layerGroup().addTo(this.map);

        await this.loadSlides();
        await this.loadStoryFrames();
        await this.loadFeatures();
        // todo removed for d3 test
        this.attachMapEvents();
        this.initStoryFeatureLayers();

        // All features layer used for building filtered layers
        this.initAllFeaturesLayer();

        this.getSlideElements();
        let observer = new IntersectionObserver(function (entries) {
            //console.log(entries[0].target.dataset);
            if (entries[0].isIntersecting === true)
                this.triggerSlideMapEvents(entries[0].target.dataset.slideid);
        }.bind(this), {threshold: [1]});


        // Add for temporary debugging, will be used for filter
        //this.storyFeatureLayerGroup.addLayer(this.allFeaturesLayer);
        for (let s = 0; s < this.slideElements.length; s++) {
            observer.observe(this.slideElements[s]);
        }
        // Add intersection observer for filters
        observer.observe(document.getElementById("filters"));

        /*this.map.on('click', function (e) {
            console.log(e.target);
        });*/
        await this.loadD3();

        await this.sleep(700);
        //await this.playHomelandsIntro();
        await this.playPathways1Intro();
    }

    clearFeatureText() {
        this.storyFeatureLayerGroup.eachLayer(function (layer) {
            let features = layer._layers;
            for (let [key, feature] of Object.entries(features)) {
                let featureId = feature.feature.properties.id;
                //console.log(key);
                if (this.textFeatures[featureId] && feature._text != null) {
                    //console.log(feature);
                    feature.setText(null);
                }
            }
        }.bind(this));
    }

    /** Map level events such as zoom, used to update text levels
     *
     */
    attachMapEvents() {

        this.map.on('zoomend', function () {
            let TextSize = (this.map.getZoom() + 4) + 'px';
            console.log(this.map.getZoom());
            this.storyFeatureLayerGroup.eachLayer(function (layer) {
                if (this.clonedRiverLayer && layer == this.clonedRiverLayer) {

                    let features = layer._layers;
                    for (let [key, feature] of Object.entries(features)) {
                        let featureId = feature.feature.properties.id;
                        //console.log(key);
                        if (this.textFeatures[featureId]) {
                            //console.log(feature.feature.properties);
                            feature.setText(null);
                            if (this.map.getZoom() >= this.textMinZoomLevel) {
                                let textAttributes = this.defaultTextAttributes;
                                textAttributes['font-size'] = TextSize;
                                feature.setText(this.textFeatures[featureId].text,
                                    {
                                        orientation: this.textFeatures[featureId].orientation,
                                        offset: 5,
                                        center: true,
                                        attributes: textAttributes
                                    }
                                );
                            }
                        }
                    }
                }


                /* layer.onEachFeature(function(feature){
                    console.log(feature);
                 });*/
                /**/
            }.bind(this));
            //for (let x=0; x< this.storyFeatureLayerGroup.getLayers());
        }.bind(this));
    }

    onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && (feature.properties.map_text || feature.properties.norm_text) || feature.properties.Name) {
            if (feature.properties.map_text) {
                layer.bindPopup(feature.properties.map_text)
                if (feature.properties.date_yr) {
                    layer.bindPopup(feature.properties.map_text + "</br><strong>" + mapLookup[feature.properties.map_source] + "</stong>")
                }
            } else if (feature.properties.norm_text) {
                layer.bindPopup(feature.properties.norm_text);
                if (feature.properties.date_yr) {
                    layer.bindPopup(feature.properties.norm_text + "</br><strong>" + mapLookup[feature.properties.map_source] + "</stong>")
                }
            } else {
                layer.bindPopup(feature.properties.Name + "</br><strong>Native Land Data API</strong>");
            }

        }
        switch (feature.geometry.type) {
            case "Point":
                // Do nothing - point styles are defined in pointToFeature
                break;
            // If polys
            case "MultiPolygon":
                switch (feature.properties.sub_type) {
                    case 3:
                        layer.setStyle(polyBorderStyle);
                        break;
                    case 4:
                        layer.setStyle(polySettlementStyle);
                        break;
                    case 6:
                        layer.setStyle(polySeaRouteStyle);
                        break;
                    case 7:
                        layer.setStyle(polyDescriptiveStyle);
                        break;
                    case 8:
                        layer.setStyle(polyRiverRouteStyle);
                        break;
                    case 9:
                        layer.setStyle(polyMiscStyle);
                        break;
                    case 10:
                        layer.setStyle(polyToponymStyle);
                        break;
                    case 11:
                        // Capture Indig vs Haudenasnee
                        switch (feature.properties.identity) {
                            case 2:
                                // Red poly
                                layer.setStyle(polyNativeStyle);
                                break;
                            case 3:
                                //Grey poly (Haudenasuanee)
                                layer.setStyle(polyAnnoStyle);
                                break;
                            default:
                                layer.setStyle(polyEuroStyle);
                        }
                        break;
                }
                break;
            // If lines
            case "MultiLineString":
                switch (feature.properties.sub_type) {
                    case 3:
                        layer.setStyle(lineBorderStyle);
                        layer.setText(feature.properties.norm_text);
                        break;
                    case 5:
                        layer.setStyle(lineLandRouteStyle);
                        layer.setText(feature.properties.norm_text);
                        break;
                    case 6:
                        layer.setStyle(lineSeaRouteStyle);
                        layer.setText(feature.properties.norm_text);
                        break;
                    case 8:
                        //this.clonedRiverLayer = cloneLayer(layer)
                        //this.clonedRiverLayer.setStyle(lineRiverRouteStyleLabel).addTo(storyMap.map);
                        layer.setStyle(lineRiverRouteStyle);

                        /* this.textFeatures[feature.properties.id] = {
                             orientation: testDirection(feature),
                             text: feature.properties.norm_text
                         }*/

                        /*layer.setText(feature.properties.norm_text,
                            {
                                orientation: testDirection(feature), offset: 5, center: true,
                                attributes: {
                                    'fill': 'black',
                                    'font-family': 'EB Garamond, serif',
                                    'font-weight': 'bold',
                                    'font-size': '7px',
                                    //'textLength': 300,
                                    //'lengthAdjust': 'spacing',
                                    'dx': '15%',
                                }
                            }
                        );*/
                        break;
                    case 9:
                        layer.setStyle(lineMiscStyle);
                        layer.setText(feature.properties.norm_text);
                        break;
                    case 10:
                        layer.setStyle(lineToponymStyle);
                        layer.setText(feature.properties.norm_text);
                        break;
                }
                break;
            default:
                layer.setStyle(this.defaultLineStyle);

        }
    }


    getStoryFrameBounds(fid) {
        for (let f = 0; f < this.storyFrames.length; f++) {
            if (this.storyFrames[f].FID == fid) {
                return this.storyFrames[f].bounds;
            }
        }
        return null;
    }

    /**
     * Load the story frame objects from json, convert the feature to bounds and
     * store to be added to slides later
     * @returns {Promise<void>}
     */
    async loadStoryFrames() {
        if (this.storyUris && this.storyUris.storyFrame) {
            let storyFrames = await this.loadShapeFile(this.storyUris.storyFrame); // loadShapes([this.storyFrame_uri]);

            for (let s = 0; s < storyFrames.features.length; s++) {
                let feature = storyFrames.features[s];
                let bounds = L.geoJson(feature.geometry).getBounds();
                this.storyFrames.push({
                    FID: feature.properties.FID, feature: feature,
                    bounds: bounds
                });
            }
        }

    }

    /** Load separate feature files and assign to slides
     *
     * @returns {Promise<void>}
     */
    async loadFeatures() {
        if (this.storyUris && this.storyUris.lines) {
            // console.log(storyFeatures);
            let storyFeatures = await this.loadShapes([this.storyUris.lines]);

            for (let f = 0; f < storyFeatures.length; f++) {
                this.addFeatureToSlideGroups("LINE", storyFeatures[f]);
                // todo add feature to river labels group here
                // Then use this layer only
            }

            storyFeatures = await this.loadShapes([this.storyUris.points]);
            for (let f = 0; f < storyFeatures.length; f++) {
                this.addFeatureToSlideGroups("POINT", storyFeatures[f]);
            }

            storyFeatures = await this.loadShapes([this.storyUris.polys]);
            for (let f = 0; f < storyFeatures.length; f++) {
                this.addFeatureToSlideGroups("POLY", storyFeatures[f]);
            }

            storyFeatures = await this.loadShapeFile([this.storyUris.indigenous]);

            for (let f = 0; f < storyFeatures.features.length; f++) {

                this.addFeatureToSlideGroups("INDIGENOUS", storyFeatures.features[f]);
            }

        }

    };


    filterFeature(feature, filters) {
        let result = false;
        for (const [field, includeValues] of Object.entries(filters)) {
            // If they match ALL include rules, set to include
            if (
                field in feature.properties && includeValues.includes(feature.properties[field])
            ) {

                result = true;
            } else {
                result = false;
                break;
            }
        }
        return result;
    }

    /*
    isFeatureIncluded(
        featureType, feature, lineIncludes, lineExcludes, polyIncludes, polyExcludes,
        pointIncludes, pointExcludes, indigenousIncludes
    ) {
        let includeFeature = false;
        switch (featureType) {
            case "LINE":

                if (lineIncludes) {
                    includeFeature = this.filterFeature(feature, lineIncludes);

                }
                if (lineExcludes && includeFeature === true) {
                    includeFeature = !this.filterFeature(feature, lineExcludes);
                }

                break;

            case "POLY":

                if (pointIncludes) {
                    includeFeature = this.filterFeature(feature, polyIncludes);
                }
                if (polyExcludes && includeFeature === true) {
                    includeFeature = !this.filterFeature(feature, polyExcludes);
                }

                break;
            case "POINT":

                if (pointIncludes) {
                    includeFeature = this.filterFeature(feature, pointIncludes);
                    console.log('included');
                }
                if (pointExcludes && includeFeature === true) {
                    includeFeature = !this.filterFeature(feature, pointExcludes);

                }

                break;
            case "INDIGENOUS":
                if (indigenousIncludes) {
                    includeFeature = this.filterFeature(feature, indigenousIncludes);
                }
                break
            default:
                break;
        }
        return includeFeature;
    }*/

    /**
     * Add the feature to as many slide groups
     * as pass the conditions in slideRules.
     *
     * @param featureType point, poly, line
     * @param feature the feature to assign
     */
    addFeatureToSlideGroups(featureType, feature) {
        for (let s = 0; s < this.slides.length; s++) {
            // Foreach slide rule
            let slide = this.slides[s];
            let includeFeature = false;
            switch (featureType) {
                case "LINE":
                    if (slide.lines) {
                        if (slide.lines.includes) {
                            includeFeature = this.filterFeature(feature, slide.lines.includes);

                        }
                        if (slide.lines.excludes && includeFeature === true) {
                            includeFeature = !this.filterFeature(feature, slide.lines.excludes);
                        }
                    }
                    break;

                case "POLY":
                    if (slide.polys) {
                        if (slide.polys.includes) {
                            includeFeature = this.filterFeature(feature, slide.polys.includes);
                        }
                        if (slide.polys.excludes && includeFeature === true) {
                            includeFeature = !this.filterFeature(feature, slide.polys.excludes);
                        }
                    }
                    break;
                case "POINT":
                    if (slide.points) {
                        if (slide.points.includes) {
                            includeFeature = this.filterFeature(feature, slide.points.includes);
                        }
                        if (slide.points.excludes && includeFeature === true) {
                            includeFeature = !this.filterFeature(feature, slide.points.excludes);
                            /*for (const [field, value] of Object.entries(feature.properties)) {
                                if (
                                    field in slide.points.excludes &&
                                    slide.points.excludes[field].includes(value)
                                ) {
                                    includeFeature = false;
                                    break;
                                }
                            }*/
                        }
                    }
                    break;
                case "INDIGENOUS":
                    if (slide.indigenous) {
                        includeFeature = this.filterFeature(feature, slide.indigenous.includes);
                    }
                    break
                default:
                    break;
            }
            if (includeFeature) {
                slide.features.push(feature);
            }
        }
    }

    /*
    addFeatureToSlideGroups(featureType, feature) {
        for (let s = 0; s < this.slides.length; s++) {
            // Foreach slide rule
            let slide = this.slides[s];
            if (slide && feature != null) {
                let lineIncludes = null;
                let lineExcludes = null;
                let polyIncludes = null;
                let polyExcludes = null;
                let pointIncludes = null;
                let pointExcludes  = null;
                let indigenousIncludes = null;

                if (slide.lines) {
                    lineIncludes = slide.lines.includes;
                    lineExcludes = slide.lines.excludes;
                }

                if (slide.polys){
                    polyIncludes = slide.polys.includes;
                    polyExcludes = slide.polys.excludes;
                }

                if (slide.points != null){
                    if (slide.points.includes !=null){
                      pointIncludes = slide.points.includes;
                       console.log(slide.points.includes.length);
                    }
                    if (slide.points.excludes !=null && slide.points.excludes.length > 0){
                        pointExcludes = slide.points.excludes;
                    }


                }

                let includeFeature = this.isFeatureIncluded(
                    featureType, feature, lineIncludes, lineExcludes,
                    polyIncludes, polyExcludes,
                    pointIncludes, pointExcludes, indigenousIncludes
                )

                if (includeFeature) {
                    slide.features.push(feature);
                }
            }
        }
    }*/

    // Explore and filter functionality

    loadExploreLayer() {

    }

}

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




