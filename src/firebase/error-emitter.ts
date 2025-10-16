'use client';
import mitt from 'mitt';
import type { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': FirestorePermissionError;
};

// C-style cast to workaround a bug in mitt's types.
export const errorEmitter = mitt<Events>() as unknown as mitt.Emitter<Events>;
