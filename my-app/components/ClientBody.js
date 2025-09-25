'use client';

import { useEffect, useState } from 'react';

export default function ClientBody({ children, className }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <body className={className}>
        {children}
      </body>
    );
  }

  return (
    <body className={className}>
      {children}
    </body>
  );
}