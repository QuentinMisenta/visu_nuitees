"use client";
import {geoMercator, geoPath} from "d3-geo";
import {useEffect, useState} from "react";
import ZoomControl from "./ZoomControl";
import {interpolateYlGnBu} from "d3-scale-chromatic";
import {Tooltip, Typography} from "@mui/material";
import {scaleLinear} from "d3-scale";
import CircularProgress from "@mui/joy/CircularProgress";
import Sheet from "@mui/joy/Sheet";

/**
 * The SwissMap component renders a map of Switzerland with the cantons colored according to the number of overnight stays by foreign visitors in 2019.
 * It uses the geoMercator and geoPath functions from D3-geo for map projection and path generation.
 * The useEffect and useState hooks from React are used for managing component state and side effects.
 * Additionally, the ZoomControl component, scaleLinear function from D3-scale, and interpolateYlGnBu function from D3-scale-chromatic are imported.
 */

export default function CantonMap({canton, dataNuitees}) {
    // Use the useState hook to create state variables for the selected canton, the TopoJSON data, the width and height of the map, and the scale and translate of the map.
    const [selectedCanton, setSelectedCanton] = useState(canton);
    const [topoJsonData, setTopoJsonData] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState([0, 0]);
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Use the useEffect hook to set the width and height of the map to 4/5 of the window width and 3/4 of the window height.
    useEffect(() => {
        setWidth((window.innerWidth * 4) / 5);
    }, []);

    // Use the useEffect hook to set the height of the map to 3/4 of the window height.
    useEffect(() => {
        setHeight(window.innerHeight * 0.75);
    }, []);

    // Use the useEffect hook to fetch the TopoJSON data for the Swiss cantons map and set it in the component's state
    // using setTopoJsonData.This hook is called when the selectedCanton state variable changes.
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const topoJSON = await fetch(`api/maps/${selectedCanton}`);
            const data = await topoJSON.json();
            setTopoJsonData(data);
            setIsLoading(false);
        }

        fetchData();
    }, [selectedCanton]);

    // Use the geoMercator function to create a projection for the map.
    let projection = geoMercator().fitExtent(
        [
            [0, 0],
            [width, height],
        ],
        topoJsonData
    );
    let path = geoPath().projection(projection);

    // find the maximum number of overnight stays by foreign visitors.
    const maxNuitees = Math.max(
        ...dataNuitees.map((d) => d._sum.Pays_de_provenance___total_Nuit_es)
    );
    // Create an array of legend items.
    const legendItems = [];

    // Create a legend item for each color in the color scale.
    for (let i = 0; i < 4; i++) {
        const startNuitees = Math.round(((i / 4) * maxNuitees) / 1000) * 1000;
        const endNuitees = Math.round((((i + 1) / 4) * maxNuitees) / 1000) * 1000;
        const startColor = interpolateYlGnBu(i / 4);
        const endColor = interpolateYlGnBu((i + 1) / 4);
        legendItems.push(
            <li key={i} className="grid w-auto grid-cols-3">
                <div>
          <span
              style={{backgroundColor: startColor}}
              className="mr-2 inline-block h-4 w-4 "
          ></span>
                    {startNuitees.toLocaleString("fr-CH")}
                </div>
                <div>-</div>

                <div>
          <span
              style={{backgroundColor: endColor}}
              className="mr-2 inline-block h-4 w-4 "
          ></span>
                    {endNuitees.toLocaleString("fr-CH")}
                </div>
            </li>
        );
    }
    // Create a color scale for the number of overnight stays by foreign visitors.
    const colorScale = scaleLinear().domain([0, maxNuitees]).range([0, 1]);

    // Use the useEffect hook to update the selectedCanton state variable when the canton prop changes.
    useEffect(() => {
        setSelectedCanton(canton);
    }, [canton]);

    // Use the useEffect hook to update the width and height state variables when the window is resized.
    useEffect(() => {
        function handleResize() {
            setWidth((window.innerWidth * 4) / 5);
            setHeight(window.innerHeight * 0.75);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handles the mouse down event when dragging the map
    function handleMouseDown(event) {
        setDragging(true);
        setStartPos([event.clientX, event.clientY]);
    }

    // Handles the mouse move event when dragging the map
    function handleMouseMove(event) {
        if (dragging) {
            const dx = event.clientX - startPos[0];
            const dy = event.clientY - startPos[1];
            setTranslate([translate[0] + dx, translate[1] + dy]);
            setStartPos([event.clientX, event.clientY]);
        }
    }

    // Handles the mouse up event when dragging the map
    function handleMouseUp() {
        setDragging(false);
    }

    if (!topoJsonData) {
        return null;
    }

    // Define a function to get the number of overnight stays by foreign visitors for a given commune.
    function getNuitesByCommune(commune) {
        const data = dataNuitees.find((d) => d.Commune === commune);
        return data?._sum.Pays_de_provenance___total_Nuit_es || 0;
    }

    // If the TopoJSON data has not been fetched yet, return a loading indicator.
    if (isLoading) {
        return (
            <div className="my-36 flex h-full items-center justify-center">
                <CircularProgress size="lg"/>
            </div>
        );
        // If the TopoJSON data has been fetched, render the map.
    } else {
        /* Render the cantons as paths. */
        return (
            // Render the map as an SVG element with a group element for each canton.
            <div className="flex h-full w-full flex-row pt-4">
                <Sheet className="mx-6 my-3 flex w-9/12 rounded-[20px] shadow-lg" variant="outlined">
                    <svg
                        width={width}
                        height={height}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        {" "}
                        {/*Render a group element for each canton. */}
                        <g
                            transform={`translate(${translate[0]}, ${translate[1]}) scale(${scale})`}
                        >
                            {/* Render a path element for each canton. */}
                            {topoJsonData.features.map((feature) => (
                                /* Render a Tooltip component for each canton. */
                                <Tooltip
                                    key={feature.properties.UUID}
                                    title={
                                        <Typography fontSize={18}>
                                            {/* Render the canton name and the number of overnight stays by foreign visitors. */}
                                            {feature.properties.NAME}:{" "}
                                            {getNuitesByCommune(feature.properties.NAME) === 0
                                                ? "Pas de données"
                                                : getNuitesByCommune(feature.properties.NAME)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, "'") + " nuitées"}
                                        </Typography>
                                    }
                                >
                                    {/* Render the path element for the canton. */}
                                    <path
                                        stroke="black"
                                        strokeWidth={0.35}
                                        fill={
                                            /* Color the commune according to the number of overnight stays. */
                                            getNuitesByCommune(feature.properties.NAME) === 0
                                                ? "white"
                                                : interpolateYlGnBu(
                                                    colorScale(
                                                        getNuitesByCommune(feature.properties.NAME)
                                                    )
                                                )
                                        }
                                        d={path(feature)}
                                    />
                                </Tooltip>
                            ))}
                        </g>
                    </svg>
                </Sheet>
                <div className="flex w-3/12 flex-col">
                    <div className="flex h-3/5 justify-center pl-4">
                        {/* Render the ZoomControl component with the scale and setScale props. */}
                        <ZoomControl
                            class="w-full "
                            scale={scale}
                            setScale={setScale}
                            data-for="legend-tooltip"
                        />
                    </div>
                    <Sheet className="my-4 grow place-self-center rounded-[20px] pt-10 shadow-lg" variant="outlined">
                        <div className="px-3">
                            <h2 className="pb-3 text-3xl font-bold text-blue-950"> Nombre de nuitées </h2>
                            <ul>{legendItems}</ul>
                        </div>
                    </Sheet>
                </div>
            </div>
        );
    }
}
