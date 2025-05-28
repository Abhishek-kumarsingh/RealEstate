# Testing Guide - RealEstate Pro

This guide covers comprehensive testing strategies for the RealEstate Pro platform.

## 🧪 Testing Setup

### Prerequisites
```bash
# Install testing dependencies
npm install

# Set up test environment variables
cp .env.example .env.test
```

### Test Environment Configuration
Create `.env.test` with test-specific values:
```bash
DATABASE_URL="postgresql://test:test@localhost:5432/realestate_test"
JWT_SECRET="test-jwt-secret-for-testing-only"
GOOGLE_AI_API_KEY="test-google-ai-key"
REDIS_URL="redis://localhost:6379/1"
```

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### API Tests Only
```bash
npm run test:api
```

## 📋 Test Categories

### 1. Unit Tests
Test individual functions and utilities:

```bash
# Test specific utility functions
npm test -- --testPathPattern=lib/
```

**Coverage Areas:**
- Authentication utilities (`lib/jwt.ts`)
- Database utilities (`lib/db-utils.ts`)
- Notification utilities (`lib/notifications.ts`)
- Email utilities (`lib/email.ts`)
- Cache utilities (`lib/cache.ts`)

### 2. API Integration Tests
Test API endpoints with mocked database:

```bash
# Test authentication endpoints
npm test -- --testPathPattern=__tests__/api/auth

# Test notification endpoints
npm test -- --testPathPattern=__tests__/api/notifications
```

**Coverage Areas:**
- Authentication (`/api/auth/*`)
- Properties (`/api/properties/*`)
- Inquiries (`/api/inquiries/*`)
- Notifications (`/api/notifications/*`)
- Users (`/api/users/*`)
- Agents (`/api/agents/*`)

### 3. Component Tests
Test React components:

```bash
# Test dashboard components
npm test -- --testPathPattern=components/dashboard
```

**Coverage Areas:**
- Dashboard components
- Property components
- Authentication forms
- Notification center

## 🔧 Test Utilities

### Mock Data
Use the provided mock data for consistent testing:

```typescript
// Example: Testing with mock property data
import { mockProperties } from '@/__tests__/mocks/properties';

test('should filter properties by type', () => {
  const filtered = filterPropertiesByType(mockProperties, 'HOUSE');
  expect(filtered).toHaveLength(2);
});
```

### Database Mocking
All tests use mocked Prisma client:

```typescript
import { prisma } from '@/lib/prisma';

// Mock Prisma in your tests
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

beforeEach(() => {
  mockPrisma.user.findUnique.mockResolvedValue(mockUser);
});
```

## 📊 Testing Best Practices

### 1. Test Structure
Follow the AAA pattern:
```typescript
test('should create user successfully', async () => {
  // Arrange
  const userData = { name: 'Test', email: 'test@example.com' };
  mockPrisma.user.create.mockResolvedValue(mockUser);

  // Act
  const result = await createUser(userData);

  // Assert
  expect(result.success).toBe(true);
  expect(result.user.email).toBe('test@example.com');
});
```

### 2. Error Testing
Always test error scenarios:
```typescript
test('should handle database errors gracefully', async () => {
  mockPrisma.user.create.mockRejectedValue(new Error('DB Error'));
  
  const result = await createUser(userData);
  
  expect(result.success).toBe(false);
  expect(result.error).toBeDefined();
});
```

### 3. Async Testing
Use proper async/await patterns:
```typescript
test('should handle async operations', async () => {
  const promise = asyncFunction();
  await expect(promise).resolves.toBeDefined();
});
```

## 🎯 Critical Test Scenarios

### Authentication
- [x] User registration with valid data
- [x] User registration with duplicate email
- [x] User login with valid credentials
- [x] User login with invalid credentials
- [x] JWT token validation
- [x] Password hashing verification

### Property Management
- [ ] Property creation by agents
- [ ] Property approval workflow
- [ ] Property search and filtering
- [ ] Property image upload
- [ ] Property status updates

### Inquiry System
- [ ] Inquiry creation
- [ ] Notification sending
- [ ] Email notifications
- [ ] Inquiry response handling
- [ ] Status tracking

### Notification System
- [x] Notification creation
- [x] Notification retrieval
- [x] Mark as read functionality
- [x] Bulk operations
- [ ] Real-time updates

## 🚨 Performance Testing

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Run load tests
artillery run load-tests/api-load-test.yml
```

### Database Performance
```bash
# Test database query performance
npm test -- --testPathPattern=performance
```

### Cache Testing
```bash
# Test Redis cache performance
npm test -- --testPathPattern=cache
```

## 📈 Coverage Goals

### Minimum Coverage Targets
- **Overall**: 80%
- **API Routes**: 90%
- **Utilities**: 85%
- **Components**: 75%

### Coverage Reports
```bash
# Generate detailed coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🔍 Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output
```bash
# Get detailed test output
npm test -- --verbose
```

### Test Specific Files
```bash
# Test specific file
npm test -- auth.test.ts

# Test with pattern
npm test -- --testNamePattern="should login"
```

## 🛠️ Continuous Integration

### GitHub Actions
The project includes CI/CD pipeline that:
- Runs all tests on pull requests
- Generates coverage reports
- Blocks merges if tests fail
- Runs performance benchmarks

### Pre-commit Hooks
```bash
# Install pre-commit hooks
npm run prepare

# Tests will run automatically before commits
git commit -m "Add new feature"
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Ensure test database is running
   docker run -d -p 5432:5432 -e POSTGRES_DB=realestate_test postgres
   ```

2. **Redis Connection Errors**
   ```bash
   # Start Redis for cache testing
   docker run -d -p 6379:6379 redis
   ```

3. **Environment Variables**
   ```bash
   # Verify test environment
   npm run test:env
   ```

4. **Mock Issues**
   ```bash
   # Clear Jest cache
   npm test -- --clearCache
   ```
