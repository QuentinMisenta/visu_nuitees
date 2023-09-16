export default function Loading() {
    return (
        <div role="status"
             className="m-28 h-2/3 animate-pulse rounded border border-gray-200 p-4 shadow dark:border-gray-700 md:p-6">
            <div className="mb-2.5 h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-10 h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="mt-4 flex items-baseline space-x-6">
                <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-64 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}