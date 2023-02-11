/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['gitlabApiToken']).then((result) => {
      setToken(result.gitlabApiToken);
    });
  }, []);

  const saveToken = async () => {
    await chrome.storage.local.set({ gitlabApiToken: token });
    setSuccess(true);
  };

  return (
    <div className="App">
      <h1>🔎 GitLab Spotlight</h1>
      
      <label>Bitte GitLab API Token eingeben (read_api):</label>
      
      <input
        type="text"
        placeholder="aish-3SXsufkYqSTSsjdU6oaw"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      
      <button onClick={saveToken}>Speichern</button>

      {success && <i>Gespeichert!</i>}
    </div>
  );
}

export default App;
