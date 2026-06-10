export const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
      <p className="text-sm text-gray-500 mt-2">You don't have permission to view this page.</p>
      <a href="/login" className="mt-6 inline-block text-blue-600 hover:underline">Go to Login</a>
    </div>
  </div>
);