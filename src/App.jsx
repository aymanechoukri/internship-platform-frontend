/**
 * @file App.jsx
 * @description Application root component.
 * Wraps the route tree with global providers (AuthProvider) and renders RouterProvider.
 */

import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { router } from './routes/index.jsx';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
