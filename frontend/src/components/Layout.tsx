
import { ReactNode } from 'react';
import Navigation from './Navigation';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
      <ChatBot />
    </div>
  );
};

export default Layout;
