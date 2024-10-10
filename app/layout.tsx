"use client";

import { SessionProvider } from 'next-auth/react';
import './layout.css'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="content-container">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
}
