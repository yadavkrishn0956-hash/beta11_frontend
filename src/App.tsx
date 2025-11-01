import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { Records } from './pages/Records';
import { AICenter } from './pages/AICenter';
import { Access } from './pages/Access';
import { Emergency } from './pages/Emergency';
import { BlockchainLog } from './pages/BlockchainLog';
import { Integration } from './pages/Integration';
import { Feedback } from './pages/Feedback';
import { Profile } from './pages/Profile';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Handle link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = new URL(link.href).pathname;
        window.history.pushState({}, '', path);
        setCurrentPath(path);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/records':
        return <Records />;
      case '/ai-center':
        return <AICenter />;
      case '/access':
        return <Access />;
      case '/emergency':
        return <Emergency />;
      case '/blockchain-log':
        return <BlockchainLog />;
      case '/logs':
        return <BlockchainLog />;
      case '/integration':
        return <Integration />;
      case '/interop':
        return <Integration />;
      case '/feedback':
        return <Feedback />;
      case '/profile':
        return <Profile />;
      case '/':
      default:
        return <Overview />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;
