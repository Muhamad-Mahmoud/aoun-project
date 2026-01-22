"use client";

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global application error', error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold">حدث خطأ خطير</h2>
            <p className="text-muted-foreground">
              عذراً، حدث خطأ خطير في التطبيق. يرجى إعادة تحميل الصفحة.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

