import { Slider } from "@mui/material";

export default function YearSelector({ onYearChange, selectedPeriod }) {
  const { startYear, endYear } = selectedPeriod;

  const marks = Array.from({ length: 19 }, (_, i) => ({
    value: 2005 + i,
    label: `${2005 + i}`,
  }));

  const handleChange = (event, value) => {
    const newStartYear = Math.min(value[0], value[1]);
    const newEndYear = Math.max(value[0], value[1]);
    onYearChange(newStartYear, newEndYear);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-3/4">
        <Slider
          value={[startYear, endYear]}
          min={2005}
          max={2023}
          step={null}
          marks={marks}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}`}
          getAriaLabel={(index) => (index === 0 ? `Start Year` : `End Year`)}
        />
      </div>
    </div>
  );
}
