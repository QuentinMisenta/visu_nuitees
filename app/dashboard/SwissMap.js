import { geoMercator, geoPath } from "d3-geo";
import { useEffect, useState } from "react";
import ZoomControl from "./ZoomControl";
import { scaleLinear } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { Tooltip, Typography } from "@mui/material";

/**
 * The SwissMap component renders a map of Switzerland with the cantons colored according to the number of overnight stays by foreign visitors in 2019.
 * It uses the geoMercator and geoPath functions from D3-geo for map projection and path generation.
 * The useEffect and useState hooks from React are used for managing component state and side effects.
 * Additionally, the ZoomControl component, scaleLinear function from D3-scale, and interpolateYlGnBu function from D3-scale-chromatic are imported.
 */

export default function SwissMap({ dataNuiteeAgg }) {
  // Use the useState hook to create state variables for the selected canton, the TopoJSON data, the width and height of the map, and the scale and translate of the map.
  const [topoJsonData, setTopoJsonData] = useState(null);
  const [width, setWidth] = useState((window.innerWidth * 4) / 5);
  const [height, setHeight] = useState(window.innerHeight * 0.75);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState(null);

  // Use the useEffect hook to fetch the TopoJSON data for the Swiss cantons map and set it in the component's state using setTopoJsonData.
  // This hook is only called once, when the component is mounted, because it has an empty dependency array ([]).
  // This means that it will not be re-run unless the component is unmounted and then mounted again.

  useEffect(() => {
    async function fetchData() {
      const topoJSON = await fetch("http://localhost:3000/api/maps/Suisse");
      const topoJsonData = await topoJSON.json();
      setTopoJsonData(topoJsonData);
    }
    fetchData();
  }, []);

  // Use the geoMercator function to create a projection for the map.
  let projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    topoJsonData
  );
  let path = geoPath().projection(projection);

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
  // Find the maximum number of overnight stays by foreign visitors for any canton.
  const maxNuitees = Math.max(
    ...dataNuiteeAgg.map((d) => d._sum.Pays_de_provenance___total_Nuit_es)
  );

  // Create an array of legend items.
  const legendItems = [];

  // Create a legend item for each color in the color scale.
  for (let i = 0; i <= 4; i++) {
    const startNuitees = Math.round(((i / 4) * maxNuitees) / 1000);
    const endNuitees = Math.round((((i + 1) / 4) * maxNuitees) / 1000);
    const startColor = interpolateYlGnBu(i / 4);
    const endColor = interpolateYlGnBu((i + 1) / 4);
    legendItems.push(
      <li key={i}>
        <span
          style={{ backgroundColor: startColor }}
          className="w-4 h-4 inline-block mr-2"
        ></span>
        {startNuitees} nuitées -{" "}
        <span
          style={{ backgroundColor: endColor }}
          className="w-4 h-4 inline-block mr-2"
        ></span>
        {endNuitees} nuitées
      </li>
    );
  }
  // Create a color scale for the number of overnight stays by foreign visitors.
  const colorScale = scaleLinear().domain([0, maxNuitees]).range([0, 1]);

  // Define a function to get the number of overnight stays by foreign visitors for a given canton.
  function getNuitesByCanton(canton) {
    const data = dataNuiteeAgg.find((d) => d.Canton === canton);
    return data?._sum.Pays_de_provenance___total_Nuit_es || 0;
  }

  return (
    // Render the map as an SVG element with a group element for each canton.
    <div className="flex flex-row h-full pt-4">
      <div className="flex">
        <svg
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <g
            transform={`translate(${translate[0]}, ${translate[1]}) scale(${scale})`}
          >
            {topoJsonData.features.map((feature) => (
              <Tooltip
                key={`path-${feature.properties.UUID}`}
                title={
                  <Typography fontSize={18}>
                    {feature.properties.NAME}:{" "}
                    {getNuitesByCanton(feature.properties.NAME)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, "'")}{" "}
                    nuitées
                  </Typography>
                }
              >
                <path
                  stroke="black"
                  strokeWidth={0.35}
                  fill={interpolateYlGnBu(
                    colorScale(getNuitesByCanton(feature.properties.NAME))
                  )}
                  d={path(feature)}
                ></path>
              </Tooltip>
            ))}
          </g>
        </svg>
      </div>
      <div className="flex flex-col w-1/5">
        <div className="flex pl-4 h-3/5">
          {/* Render the ZoomControl component with the scale and setScale props. */}
          <ZoomControl
            class="w-full "
            scale={scale}
            setScale={setScale}
            data-for="legend-tooltip"
          />
        </div>
        <div className="pt-10 flex-grow">
          <Tooltip title="Légende">
            <div>
              <h2 className="text-3xl font-bold pb-"> Légende (en miliers) </h2>
              <ul>{legendItems}</ul>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
