import {Slider} from "@mui/material";


/**
 *
 * @param onMonthChange - function to call when the month changes
 * @param selectedPeriod  - {startMonth, endMonth}
 * @returns {JSX.Element} - the month selector
 */
export default function MonthSelector({onMonthChange, selectedPeriod}) {
    const {startMonth, endMonth} = selectedPeriod;
    const monthNames = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    const marks = monthNames.map((month, index) => ({
        value: index + 1,
        label: month,
    }));

    const handleChange = (event, value) => {
        const newStartMonth = Math.min(value[0], value[1]);
        const newEndMonth = Math.max(value[0], value[1]);
        onMonthChange(newStartMonth, newEndMonth);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-3/4">
                <Slider
                    value={[startMonth, endMonth]}
                    min={1}
                    max={12}
                    step={null}
                    marks={marks}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${monthNames[value - 1]}`}
                    getAriaLabel={(index) => (index === 0 ? "Start Month" : "End Month")}
                />
            </div>
        </div>
    );
}
