import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
  variant?: 'default' | 'destructive';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'حدث خطأ',
  message,
  onDismiss,
  className,
  variant = 'destructive',
}) => {
  return (
    <Alert
      variant={variant}
      className={cn('relative', className)}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-2 h-6 w-6"
          onClick={onDismiss}
          aria-label="إغلاق رسالة الخطأ"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
};

