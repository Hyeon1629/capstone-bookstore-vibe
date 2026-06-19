import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar';
import { queryClient } from '@/lib/queryClient';
import { isNative } from '@/lib/platform';
import { App } from '@/App';
import { WebPhoneShell } from '@/components/shared/WebPhoneShell';
import '@/styles/globals.css';

if (isNative()) {
  StatusBar.setBackgroundColor({ color: '#13171E' }).catch(() => undefined);
  StatusBar.setStyle({ style: Style.Dark }).catch(() => undefined);
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {isNative() ? (
          <App />
        ) : (
          <WebPhoneShell>
            <App />
          </WebPhoneShell>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
