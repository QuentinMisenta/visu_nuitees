'use client'
import {Suspense} from "react";
import Loading from "./loading";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
    
    const res = await fetch('http://localhost:3000/api/cantons')
    const data = await res.json();

    return(
        <div>
        <h1 className="text-6xl"> Dashboard </h1>
            <Suspense fallback={<Loading/>}>
                <Dashboard data={data}/>
            </Suspense>
        </div>
    )
}
