export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <a href="/login" className="mt-6 inline-block text-blue-600 hover:underline">Go to Login</a>
    </div>
  </div>
);