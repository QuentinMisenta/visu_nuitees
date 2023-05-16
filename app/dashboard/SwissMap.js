import {geoMercator, geoPath,} from 'd3-geo'

export default async function SwissMap() {
    const geoJSON = await fetch('http://localhost:3000/api/maps/cantons')
    const geoJsonData = await geoJSON.json()
    let projection = geoMercator().fitExtent([[0, 0], [960, 500]], geoJsonData)
    let path = geoPath().projection(projection)
return (
    <svg width='960' height='500'>
        {geoJsonData.features.map((feature) => (
            <path
                key={`path-${feature.properties.KANTONSNUM}`}
                stroke="white"
                strokeWidth={0.25}
                d={path(feature)}
            />
        ))}
    </svg>
)
}
