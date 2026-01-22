"use client";

import { useEffect } from 'react';
import { ErrorBoundary } from '@/shared/components/shared/ErrorBoundary';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Application error occurred', error, { digest: error.digest });
  }, [error]);

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">حدث خطأ</h2>
            <p className="text-muted-foreground">
              عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      }
    >
      <div />
    </ErrorBoundary>
  );
}


