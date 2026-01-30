'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './lib/react-query';

export const metadata = {
  title: 'HelloYan - 智能加密货币策略分析',
  description: '智能加密货币策略分析系统',
};

export default function RootLayout({ children }) {
  const queryClient = getQueryClient();

  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
