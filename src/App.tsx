import { useState, useEffect } from 'react'
import './App.css'

interface SharedFile {
  name: string;
  type: string;
  size: number;
}

function App() {
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Слушаем сообщения от Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
        if (event.data?.file) {
          setSharedFile(event.data.file);
        }
      });
    }

    // Слушаем событие установки PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        console.log('PWA installed');
      }
      setInstallPrompt(null);
    }
  };

  return (
    <div className="App">
      <h1>Share PWA</h1>
      {installPrompt && (
        <button onClick={handleInstall}>
          Установить приложение
        </button>
      )}
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
    </div>
  );
}

export default App