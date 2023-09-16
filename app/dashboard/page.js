"use client";
import {Suspense, useState} from "react";
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
        <div className="w-full bg-white">
            <h1 className="mt-8 pl-8 text-5xl text-blue-950"> Dashboard </h1>
            {/* Use the Suspense component to wrap the Dashboard component
       and display the Loading component while the Dashboard component is loading. */}
            <Suspense fallback={<Loading/>}>
                <Dashboard
                    listCantons={listCantons}
                    selectedCanton={selectedCanton}
                    setSelectedCanton={setSelectedCanton}
                />
            </Suspense>
        </div>
    );
}
