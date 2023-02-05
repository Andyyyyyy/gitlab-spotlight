/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import logo from './logo.svg'
import './App.css'
import CommandDialog from './CommandDialog'
import { QueryClient, QueryClientProvider } from 'react-query'


function getLogo() {
  if (window.chrome) {
    return window.chrome.runtime.getURL(logo.toString())
  }

  return logo
}
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchInterval: false, 
      retry: false,
      refetchOnWindowFocus: false, 
      refetchOnMount: false
    }
  },
})

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <CommandDialog />
    </QueryClientProvider>
  )
}

export default App


