/**
 * NoData — lightweight "no results" placeholder for tables and lists.
 *
 * Props:
 *  message — string (default: 'No data available.')
 */
function NoData({ message = 'No data available.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-gray-400">
      <svg
        className="w-10 h-10 mb-3"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125S3.75 10.903 3.75 8.625"
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default NoData
