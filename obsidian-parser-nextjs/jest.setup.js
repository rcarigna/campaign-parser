// Jest setup for Web API polyfills
const { TextDecoder, TextEncoder } = require('util');
require('whatwg-fetch');

// Polyfill TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock FormData for testing
global.FormData = class MockFormData {
  constructor() {
    this.data = new Map();
  }

  append(key, value) {
    this.data.set(key, value);
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }
};

// Mock File for testing
global.File = class MockFile {
  constructor(content, filename, options = {}) {
    this.name = filename;
    this.type = options.type || '';
    this.size = Array.isArray(content)
      ? content.join('').length
      : content.length;
  }

  async arrayBuffer() {
    return new ArrayBuffer(this.size);
  }
};

// Mock Request/Response for Next.js
Object.defineProperty(globalThis, 'Request', {
  writable: true,
  value: class MockRequest {
    constructor(url, init) {
      this.url = url;
      this.init = init;
    }
  },
});

Object.defineProperty(globalThis, 'Response', {
  writable: true,
  value: class MockResponse {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
    }

    json() {
      return Promise.resolve(this.body);
    }
  },
});
