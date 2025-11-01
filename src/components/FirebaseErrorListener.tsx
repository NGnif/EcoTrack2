'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This is a client component that will listen for the custom event
// and throw an error to be caught by Next.js's error overlay.
// This is only active in development.
export function FirebaseErrorListener() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const handler = (error: any) => {
      // Throwing the error here will cause it to be displayed in the Next.js
      // development error overlay.
      throw error;
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, []);

  return null;
}
