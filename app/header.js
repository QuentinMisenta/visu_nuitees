import Link from "next/link";

export default function Header() {
    return(
        <header className="flex justify-between items-center bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-blue-600">Nuitées en Suisse</h1>
            <nav className="flex space-x-4">
                <Link className="text-xl font-medium text-gray-700 hover:bg-blue-600 hover:text-white active:bg-blue-300 px-2 py-1 rounded"
                   href="/">Home</Link>
                <Link className="text-xl font-medium text-gray-700 hover:bg-blue-600 hover:text-white active:bg-blue-300 px-2 py-1 rounded" href="/dashboard">Dashboard</Link>
                <a className="text-xl font-medium text-gray-700 hover:bg-blue-600 hover:text-white active:bg-blue-300 px-2 py-1 rounded"
                   href="/pricing">Pricing</a>
            </nav>
        </header>
    )
}