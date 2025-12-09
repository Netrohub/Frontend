import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables for testing
process.env.VITE_API_BASE_URL = 'http://localhost:8000/api/v1';
process.env.VITE_TURNSTILE_SITE_KEY = 'test-key';

