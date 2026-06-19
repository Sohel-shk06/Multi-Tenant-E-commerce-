export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Circle Animation */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-600 animate-pulse">Loading, please wait...</p>
      </div>
    </div>
  );
};