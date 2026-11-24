/**
 * @file App.jsx
 * @description Application root with global theme and feedback providers.
 */
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { FeedbackProvider } from './context/FeedbackContext.jsx';
import { ThemeProvider, ThemeToggle } from './context/ThemeContext.jsx';
import { router } from './routes/index.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <FeedbackProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ThemeToggle />
      </FeedbackProvider>
    </ThemeProvider>
  );
}
