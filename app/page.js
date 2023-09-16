import README from "./README.mdx";
import "./markdown.css";

/**
 * The home page of the application.
 * @returns {JSX.Element} - the home page
 *
 */

export default function Home() {
  return (
    <div className="markdown">
      <README />
    </div>
  );
}
