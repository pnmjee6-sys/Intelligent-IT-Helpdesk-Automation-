import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('/api/v1/tickets Endpoint Suite', () => {
  let authToken: string;

  beforeAll(async () => {
    // 1. Try registering user first
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'admin_test@company.com',
        password: 'AdminSecret123!',
        full_name: 'System Admin',
        role: 'SYS_ADMIN',
      });

    if (regRes.body?.data?.token) {
      authToken = regRes.body.data.token;
    } else {
      // 2. If user already exists, login to get token
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin_test@company.com',
          password: 'AdminSecret123!',
        });
      authToken = loginRes.body.data.token;
    }
  });

  describe('Authentication & Authorization Checks', () => {
    it('should return 401 Unauthorized when Bearer token is missing', async () => {
      const res = await request(app).get('/api/v1/tickets');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should return 401 Unauthorized for malformed JWT token', async () => {
      const res = await request(app)
        .get('/api/v1/tickets')
        .set('Authorization', 'Bearer invalid_token_xyz');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Zod Input Schema Validation', () => {
    it('should return 400 Bad Request when title is missing in ticket creation', async () => {
      const res = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Valid description text long enough',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });

    it('should return 400 Bad Request when title is shorter than 3 characters', async () => {
      const res = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Hi',
          description: 'Valid description text long enough',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request for invalid priority enum', async () => {
      const res = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'GlobalProtect VPN Connection Drop',
          description: 'Cannot connect to US-East VPN portal',
          priority: 'SUPER_CRITICAL_INVALID',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('CRUD Operations', () => {
    let createdTicketId: string;

    it('should successfully create a ticket with 201 Created status code', async () => {
      const res = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Cannot access Okta SSO Portal',
          description: 'Receiving 403 Forbidden error during SAML authentication redirect',
          category_id: 'Identity & Access Management (IAM)',
          priority: 'HIGH',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Cannot access Okta SSO Portal');

      createdTicketId = res.body.data.id;
    });

    it('should return 200 OK and list of tickets for GET /api/v1/tickets', async () => {
      const res = await request(app)
        .get('/api/v1/tickets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return 200 OK for GET /api/v1/tickets/:id with valid UUID', async () => {
      const res = await request(app)
        .get(`/api/v1/tickets/${createdTicketId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdTicketId);
    });

    it('should update ticket status via PATCH /api/v1/tickets/:id', async () => {
      const res = await request(app)
        .patch(`/api/v1/tickets/${createdTicketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'IN_PROGRESS',
          priority: 'URGENT',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
      expect(res.body.data.priority).toBe('URGENT');
    });

    it('should return 400 Bad Request for non-UUID ticket ID parameter', async () => {
      const res = await request(app)
        .get('/api/v1/tickets/invalid-id-format')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
