import "./globals.css";
import Header from "./header";

/**
 *
 * The root layout of the application.
 *
 * @param children - the children of the layout
 * @returns {JSX.Element} - the root layout
 *
 */
export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body>
        <Header/>
        {children}
        </body>
        </html>
    );
}
