import Link from "next/link";

/**
 *
 * The header of the application.
 *
 * @returns {JSX.Element} - the header
 *
 */
export default function Header() {
    return (
        <header className="z-50 flex items-center justify-between bg-white p-4 shadow-lg">
            <h1 className="text-4xl  font-bold text-blue-950">Nuitées en Suisse</h1>
            <nav className="flex space-x-4">
                <Link id="home"
                      className="rounded px-2 py-1 text-xl font-medium text-blue-950 target:border-b-4 target:border-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-300"
                      href="/"
                >
                    Description du projet
                </Link>
                <Link
                    id="dashboard"
                    className="rounded px-2 py-1 text-xl font-medium text-blue-950 target:border-b-4 target:border-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-300"
                    href="/dashboard"
                >
                    Dashboard
                </Link>
            </nav>
        </header>
    );
}
