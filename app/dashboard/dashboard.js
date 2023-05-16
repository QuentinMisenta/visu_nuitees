import SwissMap from "./SwissMap";
export default async function Dashboard() {
    const res = await fetch('http://localhost:3000/api/cantons');
    const data = await res.json();
    return (
        <div>
            <select name='Canton' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option>Choisissez un canton ou la suisse</option>
                {data.map((data) => (
                    // eslint-disable-next-line react/jsx-key
                <option value={data.Canton}>{data.Canton}</option>
                ))}
            </select>
            <SwissMap/>
        </div>
    );
}
