
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { NotificationProvider } from './contexts/NotificationContext'
import { PlatformSettingsProvider } from './contexts/PlatformSettingsContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <PlatformSettingsProvider>
        <App />
      </PlatformSettingsProvider>
    </NotificationProvider>
  </QueryClientProvider>
);
