"use client";

import { useState, useEffect } from "react";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import CantonMap from "./CantonMap";
import SwissMap from "./SwissMap";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

/**
 * The Dashboard component renders the SwissMap, YearSelector, and MonthSelector components.
 * It uses the useState and useEffect hooks from React for managing component state and side effects.
 * Additionally, it imports the SwissMap, YearSelector, and MonthSelector components for rendering.
 * The handleSelectChange, handleYearChange, and handleMonthChange functions are used to update the
 * component state when the user selects a new canton, year, or month.
 * The data prop is passed to the component to provide the data on overnight stays by country of origin.
 */

function Dashboard({ listCantons, selectedCanton, setSelectedCanton }) {
  // Use the useState hook to create state variables for the selected canton, year, and month.
  const [selectedYear, setSelectedYear] = useState({
    startYear: 2022,
    endYear: 2023,
  });
  const [selectedMonth, setSelectedMonth] = useState({
    startMonth: 1,
    endMonth: 12,
  });
  const [dataNuiteesAgg, setDataNuiteesAgg] = useState([]);
  const [dataNuitees, setDataNuitees] = useState([]);

  // Use the handleSelectChange function to update the selectedCanton state variable when the user selects a new canton.
  const handleSelectCantonChange = (e, newCanton) => {
    setSelectedCanton(newCanton);
  };
  // Use the handleYearChange function to update the selectedYear state variable when the user selects a new year.
  const handleYearChange = (startYear, endYear) => {
    setSelectedYear({ startYear, endYear });
  };
  // Use the handleMonthChange function to update the selectedMonth state variable when the user selects a new month.
  const handleMonthChange = (startMonth, endMonth) => {
    setSelectedMonth({ startMonth, endMonth });
  };
  // Use the useEffect hook to fetch the data from the API when the component mounts and when the selected canton, year, or month changes.
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCanton === "Suisse") {
        // If the selected canton is "Suisse", fetch the aggregated data for the whole of Switzerland.
        try {
          const res = await fetch(
            `api/data/${selectedCanton}/${selectedYear.startYear}/${selectedYear.endYear}/${selectedMonth.startMonth}/${selectedMonth.endMonth}/aggregate`
          );
          const dataNuiteesAgg = await res.json();
          setDataNuiteesAgg(dataNuiteesAgg);
        } catch (error) {
          console.error(error);
        }
      } else {
        // If the selected canton is not "Suisse", fetch the data for the selected canton.
        try {
          const res = await fetch(
            `api/${selectedCanton}/${selectedYear.startYear}/${selectedYear.endYear}/${selectedMonth.startMonth}/${selectedMonth.endMonth}`
          );
          const dataNuitees = await res.json();
          setDataNuitees(dataNuitees);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [
    selectedCanton,
    selectedYear.startYear,
    selectedYear.endYear,
    selectedMonth.startMonth,
    selectedMonth.endMonth,
  ]);
  return (
    <div className="z-0 w-full">
      <div>
        {/* Use the handleSelectChange function to update the selectedCanton state variable when the user selects a new canton. */}
        <Select
          defaultValue="Suisse"
          variant="outlined"
          name="Canton"
          startDecorator={
            <img
              src={`../armoiries/Wappen_${selectedCanton}_matt.svg`}
              alt={`${selectedCanton} coat of arms`}
              className="mr-2 inline-block h-6 w-6 align-middle"
            />
          }
          className=" mx-auto mt-8 w-3/4 px-8"
          onChange={handleSelectCantonChange}
        >
          {listCantons.map((canton) => (
            <Option key={canton} value={canton}>
              <img
                src={`../armoiries/Wappen_${canton}_matt.svg`}
                alt={`${canton} coat of arms`}
                className="mr-2 inline-block h-6 w-6 align-middle"
              />
              {canton}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        {selectedCanton === "Suisse" ? (
          <SwissMap dataNuiteesAgg={dataNuiteesAgg} />
        ) : (
          <CantonMap canton={selectedCanton} dataNuitees={dataNuitees} />
        )}
      </div>
      <div>
        <YearSelector
          selectedPeriod={selectedYear}
          onYearChange={handleYearChange}
        />
        <MonthSelector
          selectedPeriod={selectedMonth}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}

export default Dashboard;
