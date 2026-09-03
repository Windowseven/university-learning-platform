# API Contract Guide: Frontend-Backend Communication

This document provides guidance on how to effectively communicate API requirements between frontend and backend teams, handle mismatches, and ensure smooth integration.

## 1. Clear API Documentation Practices

### For Backend Engineers: What Frontend Needs

When communicating with backend engineers, provide this information for each endpoint:

#### Endpoint Specification Template
```
Endpoint: GET /api/admin/analytics
Description: Retrieves administrative analytics dashboard data
Authentication: Requires ADMIN role
Headers: 
  - Authorization: Bearer <token> (or cookie-based session)
  - Content-Type: application/json
Query Parameters: None
Response: 
  - Type: AdminAnalytics (see api-types.ts)
  - Status Codes:
    * 200: Success - returns analytics data
    * 401: Unauthorized - invalid/missing authentication
    * 403: Forbidden - user lacks ADMIN role
    * 500: Internal Server Error
Example Response:
  {
    "users": { "total": 1248, "active": 892, ... },
    "courses": { "total": 42, "active": 38 },
    ...
  }
Error Response Format:
  {
    "message": "Human-readable error description",
    "errorCode": "OPTIONAL_MACHINE_READABLE_CODE"
  }
```

### Key Information to Communicate:
1. **Exact endpoint path** (including HTTP method)
2. **Authentication requirements** (which roles/permissions needed)
3. **Request format** (query params, headers, body structure)
4. **Response format** (success and error cases)
5. **Status codes** for different scenarios
6. **Performance expectations** (if any SLAs apply)

## 2. Handling Missing or Incomplete Endpoints

### During Development Phase

When frontend is ready but backend endpoints are missing:

#### Strategy 1: Mock Response Layer (Recommended)
Create temporary mock implementations in the API layer that:
- Match the expected response structure exactly
- Return realistic sample data
- Can be easily toggled off when real endpoint is ready

Example pattern in `lib/api/index.ts`:
```typescript
export const admin = {
  get analytics() {
    // USE MOCK WHEN BACKEND NOT READY
    if (process.env.USE_API_MOCKS === 'true') {
      return mockAnalyticsData; // From mock.ts
    }
    
    // CALL REAL BACKEND WHEN READY
    return fetch('/api/admin/analytics')
      .then(res => res.json())
      .catch(handleApiError);
  }
};
```

#### Strategy 2: Feature Flags
Use environment variables or a feature flag service to:
- Enable/disable mock vs real API per endpoint
- Gradually migrate frontend components
- A/B test new backend implementations

#### Strategy 3: Graceful Degradation
Design frontend components to:
- Show loading states while waiting for data
- Handle empty/null responses gracefully
- Display user-friendly messages when data is unavailable
- Retry failed requests automatically

## 3. Contract Testing Approach

### Preventing Mismatches Early

Implement these practices to catch mismatches before they reach production:

#### 1. Type Contract Verification
Use the existing `api-types.ts` as the single source of truth:
- Backend should validate responses against these TypeScript interfaces
- Consider using runtime validation libraries (zod, io-ts, etc.) on backend
- Frontend can also validate incoming data (though less critical with TS)

#### 2. OpenAPI/Swagger Specification
Generate an OpenAPI spec from your backend that:
- Defines all endpoints, methods, parameters, responses
- Includes example values matching your mock data
- Can be shared with frontend team for validation
- Enables automatic client SDK generation

#### 3. Mock Server for Frontend Development
During frontend development:
- Use tools like MSW (Mock Service Worker) or json-server
- Configure mock servers to return exact structures from `api-types.ts`
- Frontend develops against realistic mock data
- Backend team uses same mock definitions when implementing endpoints

## 4. Versioning and Evolution Strategies

### Avoiding Breaking Changes

#### Backward Compatible Changes:
- **ADD** new optional fields to responses (don't remove existing ones)
- **ADD** new endpoints (don't change existing endpoint behavior)
- **ADD** new optional query parameters (with sensible defaults)
- **MAKE** required fields optional only if you provide defaults

#### Breaking Changes (Require Coordination):
- Changing field types (string → number, object → array, etc.)
- Removing fields or making optional fields required without defaults
- Changing endpoint paths or HTTP methods
- Changing authentication requirements

#### Versioning Approaches:
1. **Path Versioning**: `/api/v1/admin/analytics`, `/api/v2/admin/analytics`
2. **Header Versioning**: `Accept: application/vnd.myapi.v2+json`
3. **Parameter Versioning**: `/api/admin/analytics?version=2`

Recommendation: Use path versioning for major breaking changes, avoid frequent version bumps for minor changes.

## 5. Communication Workflow Between Teams

### Recommended Process:

#### Phase 1: Contract Definition (Before Coding)
1. Frontend team identifies data needs from UI mockups/requirements
2. Draft API endpoints and data structures in `api-types.ts`
3. Review contract with backend team
4. Backend team confirms feasibility and suggests adjustments
5. Finalize contract - this becomes the "definition of done" for the endpoint

#### Phase 2: Parallel Development
1. Backend team implements endpoint against contract
2. Frontend team develops components using mock data layer
3. Both teams use the same contract as reference
4. Regular sync meetings to address questions/issues

#### Phase 3: Integration Testing
1. When backend endpoint is ready:
   - Frontend switches from mock to real API (toggle feature flag)
   - Joint testing session to verify contract compliance
   - Address any mismatches immediately
2. Use contract tests to automatically verify:
   - Backend responses match expected schema
   - Frontend handles all expected response variants

#### Phase 4: Release & Monitoring
1. Deploy backend endpoint
2. Gradually roll out frontend changes (canary release, feature flags)
3. Monitor error rates and performance
4. Have rollback plan ready

## 6. Specific Guidance for This Project

### Based on Code Analysis:

#### Critical Endpoints Frontend Expects:
From reviewing the code, these are the key endpoints the frontend imports and uses:

**Admin Pages:**
- `/api/admin/analytics` - Used in OverviewView
- `/api/admin/users` - Used in UsersView
- `/api/admin/courses` - Used in CoursesView
- `/api/admin/labs` - Used in LabsView
- `/api/admin/assignments` - Used in AssignmentsView
- `/api/admin/submissions` - Used in SubmissionsView

**Lecturer Pages:**
- `/api/lecturer/profile` - Used in lecturer-shell
- `/api/lecturer/analytics` - Used in lecturer dashboard
- `/api/lecturer/courses/:id/workspace` - Used in lecturer course views
- `/api/lecturer/students/:id` - Used in student profile views

**Student Pages:**
- `/api/student/profile` - Used in student-shell
- `/api/student/courses` - Used in student course views
- `/api/student/assignments` - Used in student assignment views
- `/api/student/labs` - Used in student lab views

### Recommended Communication to Backend Engineer:

> "Based on our frontend implementation, here are the API endpoints we need for initial integration:
> 
> 1. **Admin Analytics**: GET /api/admin/analytics → Returns AdminAnalytics type
> 2. **User Management**: GET /api/admin/users → Returns User[] array
> 3. **Course Catalog**: GET /api/admin/courses → Returns Course[] array
> 4. ... [list others as needed]
> 
> Please refer to `lib/api-types.ts` for the exact TypeScript interfaces that define the expected request/response structures.
> 
> For initial development, we can use mock data that matches these contracts. When your endpoints are ready, we'll toggle our API layer to point to your implementation.
> 
> Let's schedule a contract review meeting to go through each endpoint and ensure we have alignment on:
> - Authentication requirements
> - Exact response formats
> - Error handling conventions
> - Performance characteristics"

## 7. Tools to Facilitate Integration

### Recommended Tooling:
1. **TypeScript**: Already in use - ensures compile-time checking
2. **Zod or Yup**: For runtime validation on both frontend/backend
3. **MSW (Mock Service Worker)**: For realistic API mocking during frontend dev
4. **Swagger/OpenAPI**: For interactive API documentation
5. **Storybook**: For developing/test UI components in isolation with mock data
6. **Contract Testing Libraries**: Like Pact or Spring Cloud Contract (if applicable)

### Example Validation with Zod:
```typescript
// In backend validation
import { z } from 'zod';

const AdminAnalyticsSchema = z.object({
  users: z.object({
    total: z.number().int().nonnegative(),
    active: z.number().int().nonnegative(),
    // ... etc
  }),
  // ... rest of schema
});

// Validate response
const parsed = AdminAnalyticsSchema.safeParse(rawData);
if (!parsed.success) {
  throw new Error(`Invalid analytics response: ${parsed.error.message}`);
}
```

## 8. Definition of Done for API Endpoints

Consider an endpoint "done" for frontend integration when:
- [ ] Endpoint is deployed to test environment
- [ ] Responds with correct HTTP status codes
- [ ] Response matches the TypeScript interface in `api-types.ts` exactly
- [ ] Error responses follow the agreed format
- [ ] Authentication/authorization works as specified
- [ ] Performance meets basic requirements (< 2s for typical requests)
- [ ] Endpoint is documented in API specification (OpenAPI/Swagger)
- [ ] Frontend team has verified integration with real data
- [ ] Rollback plan is in place for release

## Conclusion

The key to successful frontend-backend integration is **clear communication of contracts** and **mutual accountability** to those contracts. By using the TypeScript interfaces in `api-types.ts` as the single source of truth, maintaining good documentation, and implementing proper testing strategies, you can minimize integration issues and ensure a smooth development process.

Remember: The frontend is already designed to be backend-agnostic through the API layer in `lib/api/index.ts`. Your job is to ensure that layer makes the correct calls to your backend implementation.