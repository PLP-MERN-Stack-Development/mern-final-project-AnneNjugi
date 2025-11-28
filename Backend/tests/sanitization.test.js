// Basic tests for sanitization utility
import { sanitizeString, sanitizeEmail, sanitizeInput } from '../utils/sanitization.js';

// Simple test runner
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
  }
}

// Test sanitizeString
test('sanitizeString removes HTML tags', () => {
  const input = '<script>alert("xss")</script>Hello World';
  const result = sanitizeString(input);
  if (result !== 'alert("xss")Hello World') {
    throw new Error(`Expected 'alert("xss")Hello World', got '${result}'`);
  }
});

test('sanitizeString removes javascript protocol', () => {
  const input = 'javascript:alert("xss")';
  const result = sanitizeString(input);
  if (result !== 'alert("xss")') {
    throw new Error(`Expected 'alert("xss")', got '${result}'`);
  }
});

test('sanitizeString trims whitespace', () => {
  const input = '  hello world  ';
  const result = sanitizeString(input);
  if (result !== 'hello world') {
    throw new Error(`Expected 'hello world', got '${result}'`);
  }
});

test('sanitizeString limits length', () => {
  const input = 'a'.repeat(2000);
  const result = sanitizeString(input);
  if (result.length !== 1000) {
    throw new Error(`Expected length 1000, got ${result.length}`);
  }
});

// Test sanitizeEmail
test('sanitizeEmail converts to lowercase', () => {
  const input = 'Test@Example.COM';
  const result = sanitizeEmail(input);
  if (result !== 'test@example.com') {
    throw new Error(`Expected 'test@example.com', got '${result}'`);
  }
});

test('sanitizeEmail removes harmful characters', () => {
  const input = 'test<>"@example.com';
  const result = sanitizeEmail(input);
  if (result !== 'test@example.com') {
    throw new Error(`Expected 'test@example.com', got '${result}'`);
  }
});

// Test sanitizeInput with object
test('sanitizeInput handles objects', () => {
  const input = {
    name: '  John Doe  ',
    email: 'JOHN@EXAMPLE.COM',
    message: '<script>alert("xss")</script>Hello'
  };
  const result = sanitizeInput(input);

  if (result.name !== 'John Doe') {
    throw new Error(`Expected name 'John Doe', got '${result.name}'`);
  }
  if (result.email !== 'john@example.com') {
    throw new Error(`Expected email 'john@example.com', got '${result.email}'`);
  }
  if (result.message !== 'alert("xss")Hello') {
    throw new Error(`Expected message 'alert("xss")Hello', got '${result.message}'`);
  }
});

console.log('All sanitization tests completed!');