"use client";
import { Suspense, useState } from "react";
import Loading from "./loading";
import Dashboard from "./dashboard";

export default function DashboardPage() {
  const [selectedCanton, setSelectedCanton] = useState("Suisse");
  const listCantons = [
    "Suisse",
    "Zürich",
    "Bern",
    "Luzern",
    "Uri",
    "Schwyz",
    "Obwalden",
    "Nidwalden",
    "Glarus",
    "Zug",
    "Fribourg",
    "Solothurn",
    "Basel-Stadt",
    "Basel-Landschaft",
    "Schaffhausen",
    "Appenzell Ausserrhoden",
    "Appenzell Innerrhoden",
    "St. Gallen",
    "Graubünden",
    "Aargau",
    "Thurgau",
    "Ticino",
    "Vaud",
    "Valais",
    "Neuchâtel",
    "Genève",
    "Jura",
  ];

  return (
    <div>
      <h1 className="text-6xl"> Dashboard </h1>
      <Suspense fallback={<Loading />}>
        <Dashboard
          listCantons={listCantons}
          selectedCanton={selectedCanton}
          setSelectedCanton={setSelectedCanton}
        />
      </Suspense>
    </div>
  );
}
