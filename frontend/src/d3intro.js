/*jshint esversion: 8 */

/*import L from 'leaflet';
import 'leaflet-dvf';
import 'leaflet-textpath';*/

// https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity



export class D3intro {
    constructor(geometryUris) {
        this.slideIds = {
            "5": "homelands",
            "18": "pathways1",
            "14": "pathways2",
            "20": "villagerssettlers",
            "30": "lines"
        };
        this.homelandsFile = null;
        this.svgDrawn = false;
        this.geometryUris = geometryUris;
        this.startingBounds = {
            "homelands": {
                "type": "Feature",
                "properties": {
                    "id": null,
                    "FID": 12,
                    "Narr_ID": 1,
                    "Seq_ID": 90,
                    "Desc": "Extent of Indigenous references in 12 Mitchell"
                },
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [
                            [
                                [-60.375517055951661, 50.495155542044799],
                                [-60.311892185297758, 27.407898583362975],
                                [-109.071321137306086, 27.405734834799336],
                                [-108.827782021299925, 50.546067470988127],
                                [-60.375517055951661, 50.495155542044799]
                            ]
                        ]
                    ]
                }
            },
            "pathways1": {
                "type": "Feature",
                "properties": {
                    "id": null,
                    "FID": 10,
                    "Narr_ID": 1,
                    "Seq_ID": 50,
                    "Desc": "Chesapeake Bay area"
                },
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [
                            [
                                [-80.002479839229679, 40.168441182885317],
                                [-71.788128586561726, 40.178580988048083],
                                [-71.80139894399737, 37.05857933377866],
                                [-80.029020554100995, 37.079756393203311],
                                [-80.002479839229679, 40.168441182885317]
                            ]
                        ]
                    ]
                }
            },
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    disableMapMovement(map) {
        map.zoomControl.disable();
        map.dragging.disable();
    }

    enableMapMovement(map) {
        map.zoomControl.enable();
        map.dragging.enable();
    }

    clearSvg(){
        this.svg.selectAll("*").remove();
        this.svgDrawn = false;
    }

    async SectionIntro(map, slideid) {
        let played = false;
        if (this.slideIds[slideid + ""]) {
            switch (this.slideIds[slideid + ""]) {
                case "homelands":
                    console.log("homelands");
                    // this.getStoryFrameBounds(10)
                    await this.playHomelandsIntro(map);
                    played = true;
                    break;

                case "pathways1":
                    console.log("pathways1");
                    await this.playPathways1Intro(map);
                    played = true;
                    break;

                case "pathways2":
                    console.log("pathways1");

                    played = true;
                    break;

                case "villagerssettlers":
                    console.log("settlers");

                    played = true;
                    break;
                case "lines":
                    console.log("lines");

                    played = true;
                    break;

            }
        }
        if (played){
            this.svgDrawn = true;
        }
        return played;
    }

    async loadShapeFile(shape_url) {
        let response = await fetch(shape_url);
        let json = await response.json();
        return json;
    }

    async loadD3(map) {
        /*Setup overlar pane as d3 */
        L.svg({clickable: true}).addTo(map);
        const overlay = d3.select(map.getPanes().overlayPane);
        this.svg = overlay.select('svg').attr("pointer-events", "auto");

        /* Line generators that will work with features */
        this.featureLineGenerator = d3.line()
            .x((d) => map.latLngToLayerPoint([d[1], d[0]]).x)
            .y((d) => map.latLngToLayerPoint([d[1], d[0]]).y);

        return this.svg;

    }

    /** Transform a feature into an svg path
     * Coordinates are reversed by feature line generator
     * @param feature
     * @return svg path string of feature
     */
    featureToPath(feature) {
        let pathString = "";
        switch (feature.geometry.type) {
            case "MultiPolygon":
                pathString = this.featureLineGenerator(feature.geometry.coordinates[0][0]);
                break;
            case "MultiLineString":
                pathString = this.featureLineGenerator(feature.geometry.coordinates[0]);
                break;
        }
        return pathString;
    }

    async drawHomelandsIntro(map) {

        this.svg.selectAll('.homelands')
            .data(this.homelandsFile.features)
            .join("path")
            .attr('class', 'homelands')
            .attr('title', d => d.properties.norm_text)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", "0")
            .attr("d", d => this.featureLineGenerator(d.geometry.coordinates[0][0]));

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


    }

    /** Animated intro for the homelands section in D3*/
    async playHomelandsIntro(map, startBounds) {

        if (!this.homelandsFile) {
            this.homelandsFile = await this.loadShapeFile(this.geometryUris.homelands);
        }

        let coordinates = this.homelandsFile.features[0].geometry.coordinates[0][0];

        let points = [];
        for (let i = 0; i < coordinates.length; i++) {
            let point = map.latLngToLayerPoint([coordinates[i][1], coordinates[i][0]]);
            points.push(point);
        }
        //this.drawHomelandsIntro();
        /*map.on("zoomend", function () {
            this.drawHomelandsIntro();
        }, this);

        map.on('moveend', this.drawHomelandsIntro());*/

        map.flyToBounds(L.geoJson(this.startingBounds.homelands).getBounds());
        await this.sleep(1000);
        await this.drawHomelandsIntro();

        /*console.log(points);
        this.svg.selectAll('path')
            .attr("class", "testLine")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr("d", lg(points));*/

        //map.fitBounds(L.geoJson(homelandsFile).getBounds());
        /*const Dots = this.svg.selectAll('circle')
            .attr("class", "Dots")
            .data(coordinates)
            .join('circle')
            .attr("id", "dotties")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr("cx", d => map.latLngToLayerPoint([d[1], d[0]]).x)
            .attr("cy", d => map.latLngToLayerPoint([d[1], d[0]]).y)
            .attr("r", 5);

        const update = () => Dots
            .attr("cx", d => map.latLngToLayerPoint([d[1], d[0]]).x)
            .attr("cy", d => map.latLngToLayerPoint([d[1], d[0]]).y);*/

        //map.on("zoomend", update);


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
            .data(homelandsFile.features)
            .join('circle')
                .attr("id", "dotties")
                .attr("fill", "steelblue")
                .attr("stroke", "black")
                //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                .attr("cx", d => map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x)
                .attr("cy", d => map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y)
                .attr("r", 5);*/


    }

    // todo for d3:
    // split into its own animatedintro library
    // single function using switch to handle all shape types infeatures
    // for: d => this.multipolygonToPath(d.geometry.coordinates[0])
    // Maybe use layer data depending on dat set?

    async playPathways1Intro(map) {
        let bounds = map.flyToBounds(L.geoJson(this.startingBounds.pathways1).getBounds());
        await this.sleep(1500);

        let pathwaysFile = await this.loadShapeFile(this.geometryUris.pathways1);
        console.log(pathwaysFile);
        // .attr('title', d => d.properties.norm_text)

        let riverPoints = {
            "type": "FeatureCollection",
            "name": "BCC_riverPoints",
            "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "id": 55008,
                        "feat_type": 1,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Alleguippes",
                        "norm_text": "Alleguippes",
                        "accuracy": 3,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.787050908727593, 40.368005421909643]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 50522,
                        "feat_type": 1,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Senekaas",
                        "norm_text": "Senekaas",
                        "accuracy": null,
                        "story_link": 1,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.894974320999168, 40.566423669925982]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 50521,
                        "feat_type": 1,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Buffalo T.",
                        "norm_text": "Buffalo Town",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.769007127512225, 40.738706008860092]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 51238,
                        "feat_type": 5,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Allegheny pr Old Shenpeye T. Kingl Settle pg",
                        "norm_text": "Allegheny pr Old Shenpeye T. Kingl Settle pg",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 1
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.580484797123603, 40.703635509536312]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 50523,
                        "feat_type": 1,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Shanioning",
                        "norm_text": "Shanioning",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.852128336819945, 40.524749186199799]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 51225,
                        "feat_type": 5,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Ft du Oraock",
                        "norm_text": "Fort du Oraock",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 1
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.968669413787467, 40.436757051020692]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 3747,
                        "feat_type": 4,
                        "sub_type": 8,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Carehannon",
                        "norm_text": "Carehannon",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": null
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.548778768830957, 40.987563087530106]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 50519,
                        "feat_type": 1,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Sillauringo",
                        "norm_text": "Sillauringo",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.676888261526884, 40.788357581940033]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 52949,
                        "feat_type": 1,
                        "sub_type": 10,
                        "map_source": 9,
                        "date_yr": 1754,
                        "map_text": "CAPE CHARLES",
                        "norm_text": "Cape Charles",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 1
                    },
                    "geometry": {"type": "Point", "coordinates": [-75.965140652079782, 37.148044894716968]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 3751,
                        "feat_type": 3,
                        "sub_type": 8,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Ford",
                        "norm_text": "Ford",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": null
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.068475286181751, 43.164588800799542]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 3752,
                        "feat_type": 3,
                        "sub_type": 8,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Great fall of Niagara 140 feet",
                        "norm_text": "Great fall of Niagara 140 feet",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": null
                    },
                    "geometry": {"type": "Point", "coordinates": [-79.058192249978731, 43.085158423153878]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 51230,
                        "feat_type": 5,
                        "sub_type": 4,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Storehouse",
                        "norm_text": "Storehouse",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 1
                    },
                    "geometry": {"type": "Point", "coordinates": [-78.963931084784392, 43.046970161425975]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 51331,
                        "feat_type": 1,
                        "sub_type": 10,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Irondequat B.",
                        "norm_text": "Irondequat Bay",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-77.207497053305062, 43.250720632216236]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 51701,
                        "feat_type": 1,
                        "sub_type": 10,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Cayugaes Bay",
                        "norm_text": "Cayugaes Bay",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-76.696626994222513, 43.386754273837653]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 55184,
                        "feat_type": 1,
                        "sub_type": 10,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Ofwego Bay",
                        "norm_text": "Oswego Bay",
                        "accuracy": null,
                        "story_link": null,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-76.434566848641268, 43.485642179996916]}
                },
                {
                    "type": "Feature",
                    "properties": {
                        "id": 51591,
                        "feat_type": 1,
                        "sub_type": 10,
                        "map_source": 12,
                        "date_yr": 1755,
                        "map_text": "Port Chicagou",
                        "norm_text": "Port Chicagou",
                        "accuracy": 3,
                        "story_link": 1,
                        "frame_link": null,
                        "identity": 2
                    },
                    "geometry": {"type": "Point", "coordinates": [-87.630933978956435, 41.85718320080619]}
                },
            ]
        };
        let testPoint = [
            pathwaysFile.features[0].geometry.coordinates[0][0],
        ];
        console.log(testPoint);
        // https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61
        this.svg.selectAll('.river')
            .data(pathwaysFile.features)
            .join("path")
                .attr('class', 'pathways1 river')
                .attr("stroke", "blue")
                .attr("fill", "none")
                .attr("stroke-width", "1.5")
                .attr("d", d => this.featureToPath(d));

        await this.svg.selectAll('path.river').each(function(d){d.totalLength = this.getTotalLength();})
            .attr("stroke-dashoffset", d => d.totalLength)
            .attr("stroke-dasharray", d => d.totalLength)
            .transition()
                .duration(2500)
                .attr("stroke-dashoffset", 0)
                .end();

        const settlements = this.svg.selectAll('circle')
            .attr("class", "Dots")
            .data(riverPoints.features)
            .join('circle')
            .attr("class", "pathways1 settlements")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
            //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
            //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
            .attr("cx", d => map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).x)
            .attr("cy", d => map.latLngToLayerPoint([d.geometry.coordinates[1], d.geometry.coordinates[0]]).y)
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

         await this.sleep(1500);
         this.clearSvg();

    }

    async playPathways2Intro() {

    }

    async playLinesIntro() {

    }
}

