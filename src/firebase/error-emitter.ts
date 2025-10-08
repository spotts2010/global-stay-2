// src/firebase/error-emitter.ts
import { EventEmitter } from 'events';

// It's important to use a single, shared instance of the emitter.
const errorEmitter = new EventEmitter();

export { errorEmitter };
