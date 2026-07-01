'use client';

import { useEffect } from 'react';
import { configureAmplify } from '@/lib/amplify';
import '@aws-amplify/ui-react/styles.css';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}