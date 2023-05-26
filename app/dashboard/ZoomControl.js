import Slider from '@mui/material/Slider'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useCallback } from 'react';

export default function ZoomControl(props) {
    const { scale, setScale } = props;

    const handleChange = useCallback((event, value) => {
        setScale(value);
    }, [setScale]);

    return (
        <div className="flex flex-col items-center justify-between h-full">
            <ZoomOutIcon />
            <Slider
                className="p-4"
                aria-label='Zoom'
                value={scale}
                orientation="vertical"
                min={0.1}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                onChange={handleChange}
                style={{ margin: '0 16px' }}
            />
            <ZoomInIcon />
        </div>
    );
}