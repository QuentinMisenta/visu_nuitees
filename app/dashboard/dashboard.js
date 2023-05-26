"use client";

import { useState, useEffect } from "react";
import SwissMap from "./SwissMap";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";

function Dashboard({ data }) {
  const [selectedCanton, setSelectedCanton] = useState("Suisse");
  const [selectedYear, setSelectedYear] = useState({
    startYear: 2022,
    endYear: 2023,
  });
  const [selectedMonth, setSelectedMonth] = useState({
    startMonth: 1,
    endMonth: 12,
  });
  const [dataNuiteesAgg, setData] = useState([]);

  const handleSelectChange = (e) => {
    setSelectedCanton(e.target.value);
  };

  const handleYearChange = (startYear, endYear) => {
    setSelectedYear({ startYear, endYear });
  };
  const handleMonthChange = (startMonth, endMonth) => {
    setSelectedMonth({ startMonth, endMonth });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCanton) {
          const res = await fetch(
            `http://localhost:3000/api/data/${selectedCanton}/${selectedYear.startYear}/${selectedYear.endYear}/${selectedMonth.startMonth}/${selectedMonth.endMonth}/aggregate`
          );
          const dataNuiteesAgg = await res.json();
          setData(dataNuiteesAgg);
        }
      } catch (error) {
        console.error(error);
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
  console.log(dataNuiteesAgg);
  return (
    <div>
      <div>
        <select
          name="Canton"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelectChange}
        >
          <option>Choisissez un canton ou la suisse</option>
          {data.map((data) => (
            <option key={data.Canton} value={data.Canton}>
              {data.Canton}
            </option>
          ))}
        </select>
        <SwissMap canton={selectedCanton} dataNuiteeAgg={dataNuiteesAgg} />
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
