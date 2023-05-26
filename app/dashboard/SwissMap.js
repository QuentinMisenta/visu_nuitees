import { geoMercator, geoPath } from "d3-geo";
import { useEffect, useState } from "react";
import ZoomControl from "./ZoomControl";
import { scaleLinear } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";

export default function SwissMap({ canton, dataNuiteeAgg }) {
  const [selectedCanton, setSelectedCanton] = useState(canton);
  const [topoJsonData, setTopoJsonData] = useState(null);
  const [width, setWidth] = useState((window.innerWidth * 4) / 5);
  const [height, setHeight] = useState(window.innerHeight * 0.75);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const topoJSON = await fetch("http://localhost:3000/api/maps/cantons");
      const topoJsonData = await topoJSON.json();
      setTopoJsonData(topoJsonData);
    }
    fetchData();
  }, []);

  let projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    topoJsonData
  );
  let path = geoPath().projection(projection);

  useEffect(() => {
    setSelectedCanton(canton);
  }, [canton]);

  useEffect(() => {
    function handleResize() {
      setWidth((window.innerWidth * 4) / 5);
      setHeight(window.innerHeight * 0.75);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleMouseDown(event) {
    setDragging(true);
    setStartPos([event.clientX, event.clientY]);
  }

  function handleMouseMove(event) {
    if (dragging) {
      const dx = event.clientX - startPos[0];
      const dy = event.clientY - startPos[1];
      setTranslate([translate[0] + dx, translate[1] + dy]);
      setStartPos([event.clientX, event.clientY]);
    }
  }

  function handleMouseUp() {
    setDragging(false);
  }

  if (!topoJsonData) {
    return null;
  }
  const maxNuitees = Math.max(
    ...dataNuiteeAgg.map((d) => d._sum.Pays_de_provenance___total_Nuit_es)
  );
  const colorScale = scaleLinear().domain([0, maxNuitees]).range([0, 1]);
  return (
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
              <path
                key={`path-${feature.properties.UUID}`}
                stroke="black"
                strokeWidth={0.35}
                fill={interpolateYlGnBu(
                  colorScale(
                    dataNuiteeAgg.find(
                      (d) => d.Canton === feature.properties.NAME
                    )?._sum.Pays_de_provenance___total_Nuit_es || 0
                  )
                )}
                d={path(feature)}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="flex flex-col w-1/5">
        <div className="flex pl-4 h-3/5">
          <ZoomControl class="w-full " scale={scale} setScale={setScale} />
        </div>
        <div className="pt-10 flex-grow">
          <h3>Légende</h3>
        </div>
      </div>
    </div>
  );
}
