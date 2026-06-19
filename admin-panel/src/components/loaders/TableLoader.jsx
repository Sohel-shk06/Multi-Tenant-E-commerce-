export const TableLoader = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm p-4">
      <table className="w-full text-left">
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="py-4 px-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};