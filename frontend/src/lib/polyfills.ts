import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { Buffer } from "buffer";
import EventEmitter from "events";
import { Readable, Writable, Transform } from "readable-stream";

// Polyfill global objects
global.Buffer = Buffer;
global.process = {
  env: {},
  version: "",
  nextTick: setImmediate,
} as any;

// Polyfill EventEmitter
global.EventEmitter = EventEmitter;

// Polyfill https module
global.https = {
  request: () => ({
    on: () => {},
    write: () => {},
    end: () => {},
  }),
  get: () => ({
    on: () => {},
  }),
} as any;

// Polyfill stream module
global.stream = {
  Readable,
  Writable,
  Transform,
} as any;
