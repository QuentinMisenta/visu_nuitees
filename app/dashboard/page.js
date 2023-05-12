import {Suspense} from "react";
import Loading from "./loading";
import Dashboard from "./dashboard";

export default function DashboardPage() {
    return(
        <div>
        <h1 className="text-6xl"> Dashboard </h1>
            <Suspense fallback={<Loading/>}>
                <Dashboard/>
            </Suspense>
        </div>
    )
}
