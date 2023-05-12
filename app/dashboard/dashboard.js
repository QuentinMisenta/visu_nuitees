
export default async function Dashboard() {
    const res = await fetch('http://localhost:3000/api/cantons');
    const data = await res.json();
    return (
        <div>
            <h1 className="text-xl">Content</h1>
            <select name='Canton'>
                {data.map((data) => (
                    // eslint-disable-next-line react/jsx-key
                <option value={data.Canton}>{data.Canton}</option>
                ))}
            </select>
        </div>
    );
}