import { useState, useEffect } from 'react';

function App() {
  const [sharedFile, setSharedFile] = useState<{name: string, type: string, size: number} | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.file) {
          setSharedFile(event.data.file);
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Share PWA</h1>
        {sharedFile ? (
          <div>
            <h2>Полученный файл:</h2>
            <p>Название: {sharedFile.name}</p>
            <p>Тип: {sharedFile.type}</p>
            <p>Размер: {(sharedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <p>Ожидание файла для шаринга...</p>
        )}
      </header>
    </div>
  );
}

export default App;