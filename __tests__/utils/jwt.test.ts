import { signToken, verifyToken } from '@/lib/jwt';

describe('JWT Utilities', () => {
  const testPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'USER'
  };

  test('should sign and verify JWT token', () => {
    // Sign a token
    const token = signToken(testPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    // Verify the token
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(testPayload.userId);
    expect(decoded.email).toBe(testPayload.email);
    expect(decoded.role).toBe(testPayload.role);
  });

  test('should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow();
  });

  test('should throw error for empty token', () => {
    expect(() => {
      verifyToken('');
    }).toThrow();
  });
});
