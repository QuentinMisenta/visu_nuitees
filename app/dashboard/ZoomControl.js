import Slider from "@mui/material/Slider";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {useCallback} from "react";

/**
 *
 * The ZoomControl component renders a vertical slider for zooming in and out of the map.
 *
 * @param props - {scale, setScale} - the current scale and a function to call when the scale changes
 * @returns {JSX.Element} - the zoom control
 *
 */
export default function ZoomControl(props) {
    const {scale, setScale} = props;

    // Use the useCallback hook to create a function that calls setScale with the new scale value.
    const handleChange = useCallback((event, value) => {
        setScale(value);
    }, [setScale]);

    return (
        <div className="flex h-full flex-col items-center justify-between">
            <ZoomInIcon/>
            <Slider
                className="p-4"
                aria-label="Zoom"
                value={scale}
                orientation="vertical"
                min={0.75}
                max={10}
                step={0.25}
                valueLabelDisplay="auto"
                onChange={handleChange}
                style={{margin: "0 16px"}}
            />
            <ZoomOutIcon
                className="mt-8"/>
        </div>
    );
}