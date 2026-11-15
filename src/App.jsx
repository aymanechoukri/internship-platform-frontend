import { AuthProvider } from './context/AuthContext.jsx';

/**
 * @file App.jsx
 * @description Application root. Wraps the tree with global providers.
 * Router and page-level components will be composed here in future tasks.
 */
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Internship Platform
          </h1>
          <p className="text-gray-600">Welcome to the Internship Platform.</p>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
