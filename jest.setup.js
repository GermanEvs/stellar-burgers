import '@testing-library/jest-dom';

// Mock для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock для cookies
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
});

// Mock для uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

// Автоматически мокать @api
jest.mock('@api');