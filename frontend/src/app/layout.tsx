// frontend/src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { AuthProvider } from '../../context/AuthContext';
import { TransfersProvider } from '../../context/TransfersContext';
import { DashboardProvider } from '../../context/DashboardContext'; // ✅ IMPORTANTE

export const metadata = {
  title: 'SOOFT Digital Treasury',
  description: 'Gestión financiera digital B2B',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-800 flex flex-col min-h-screen">
        <AuthProvider>
          <TransfersProvider>
            <DashboardProvider> 
              <Header />
              <Navbar />
              <main className="flex-grow p-4">{children}</main>
              <Footer />
            </DashboardProvider>
          </TransfersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
