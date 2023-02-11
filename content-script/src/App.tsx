/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import logo from './logo.svg';
import './App.css';
import CommandDialog from './CommandDialog';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useState } from 'react';

function getLogo() {
  if (window.chrome) {
    return window.chrome.runtime.getURL(logo.toString());
  }

  return logo;
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function App() {
  const [token, setToken] = useState<null | string>(null);

  useEffect(() => {
    chrome.storage.local.get(['gitlabApiToken']).then((result) => {
      setToken(result.gitlabApiToken);
    });
  }, []);

  if (!token) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CommandDialog token={token} />
    </QueryClientProvider>
  );
}

export default App;
