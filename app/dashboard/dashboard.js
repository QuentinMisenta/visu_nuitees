"use client";

import { useState, useEffect } from "react";
import SwissMap from "./SwissMap";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import CantonMap from "./CantonMap";

/**
 * The Dashboard component renders the SwissMap, YearSelector, and MonthSelector components.
 * It uses the useState and useEffect hooks from React for managing component state and side effects.
 * Additionally, it imports the SwissMap, YearSelector, and MonthSelector components for rendering.
 * The handleSelectChange, handleYearChange, and handleMonthChange functions are used to update the component state when the user selects a new canton, year, or month.
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
  const handleSelectCantonChange = (e) => {
    setSelectedCanton(e.target.value);
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
        try {
          const res = await fetch(
            `http://localhost:3000/api/data/${selectedCanton}/${selectedYear.startYear}/${selectedYear.endYear}/${selectedMonth.startMonth}/${selectedMonth.endMonth}/aggregate`
          );
          const dataNuiteesAgg = await res.json();
          setDataNuiteesAgg(dataNuiteesAgg);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const res = await fetch(
            `http://localhost:3000/api/${selectedCanton}/${selectedYear.startYear}/${selectedYear.endYear}/${selectedMonth.startMonth}/${selectedMonth.endMonth}`
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
    <div>
      <div>
        {/* Use the handleSelectChange function to update the selectedCanton state variable when the user selects a new canton. */}
        <select
          name="Canton"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelectCantonChange}
        >
          <option>Choisissez un canton ou la suisse</option>
          {listCantons.map((canton) => (
            <option key={canton} value={canton}>
              {canton}
            </option>
          ))}
        </select>
        {selectedCanton === "Suisse" ? (
          <SwissMap dataNuiteeAgg={dataNuiteesAgg} />
        ) : (
          <CantonMap canton={selectedCanton} dataNuitees={dataNuitees} />
        )}
      </div>
      <YearSelector
        selectedPeriod={selectedYear}
        onYearChange={handleYearChange}
      />
      <MonthSelector
        selectedPeriod={selectedMonth}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
}

export default Dashboard;
