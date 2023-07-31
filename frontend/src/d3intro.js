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
        this.homelandsSlide = null;
        this.pathways1Slide = null;
        this.pathways2Slide = null;
        this.villagessettlersSlide = null;
        // Array here since we have four frames of data
        // for lines
        this.linesSlide = [];

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

    clearSvg() {
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
                    console.log("pathways2");

                    played = true;
                    break;

                case "villagerssettlers":
                    console.log("settlers");

                    played = true;
                    break;
                case "lines":
                    console.log("lines");
                    await this.playLinesIntro(map);
                    played = true;
                    break;

            }
        }
        if (played) {
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

    async drawHomelandsIntro(map, features) {

        this.svg.selectAll('.homelands')
            .data(features)
            .join("path")
            .attr('class', 'homelands')
            .attr('title', d => d.properties.norm_text)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", "0")
            .attr("d", d => this.featureToPath(d));

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
    async playHomelandsIntro(map, slides) {

        if (!this.homelandsLabels) {
            this.homelandsLabels = await this.loadShapeFile(this.geometryUris.homelands);
        }

      /*  let points = [];
        for (let i = 0; i < coordinates.length; i++) {
            let point = map.latLngToLayerPoint([coordinates[i][1], coordinates[i][0]]);
            points.push(point);
        }*/
        //this.drawHomelandsIntro();
        /*map.on("zoomend", function () {
            this.drawHomelandsIntro();
        }, this);

        map.on('moveend', this.drawHomelandsIntro());*/

        map.flyToBounds(L.geoJson(this.startingBounds.homelands).getBounds());
        await this.sleep(1000);
        await this.drawHomelandsIntro(map, this.homelandsSlide.features);

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

    /**
     * The D3 intro for the first pathways section
     * Rivers drawn using dash css method: https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61
     * @param map our leaflet map
     * @return {Promise<void>}
     */
    async playPathways1Intro(map) {
        let bounds = map.flyToBounds(L.geoJson(this.startingBounds.pathways1).getBounds());
        await this.sleep(1500);

        if (!this.pathways1Slide && this.pathways1Slide.features.length > 0) {

            this.svg.selectAll('.river')
                .data(this.pathways1Slide.features)
                .join("path")
                .attr('class', 'pathways1 river')
                .attr("stroke", "blue")
                .attr("fill", "none")
                .attr("stroke-width", "1.5")
                .attr("d", d => this.featureToPath(d));

            await this.svg.selectAll('path.river').each(function (d) {
                d.totalLength = this.getTotalLength();
            })
                .attr("stroke-dashoffset", d => d.totalLength)
                .attr("stroke-dasharray", d => d.totalLength)
                .transition()
                .duration(2500)
                .attr("stroke-dashoffset", 0)
                .end();
            /*
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
                        .end();*/
        }

    }

    async playPathways2Intro() {

    }

    async drawLines(features, duration, colour, majorClass, minorClass) {
        this.svg.selectAll('.' + minorClass)
            .data(features)
            .join("path")
            .attr('class', majorClass + ' ' + minorClass)
            .attr("stroke", colour)
            .attr("fill", "none")
            .attr("stroke-width", "1")
            .attr("d", d => this.featureToPath(d));

        return this.svg.selectAll('path.' + minorClass).each(function (d) {
            d.totalLength = this.getTotalLength();
        })
            .attr("stroke-dashoffset", d => d.totalLength)
            .attr("stroke-dasharray", d => d.totalLength)
            .transition()
            .duration(duration)
            .attr("stroke-dashoffset", 0)
            .end();
    }

    async playLinesIntro(map) {
        let drawDuration = 2500;
        let colour = "red";
        let majorClass = "lines";
        let minorClass = "border";
        let frameDelay = 1000;

        if (this.linesSlide && this.linesSlide.length > 0) {
            for (let f = 0; f < this.linesSlide.length; f++){
                //console.log(this.linesFeatures[f]);
                await this.drawLines(
                    this.linesSlide[f].features, drawDuration, colour, majorClass, minorClass
                );

                await this.sleep(frameDelay);
            }

        }
    }
}

