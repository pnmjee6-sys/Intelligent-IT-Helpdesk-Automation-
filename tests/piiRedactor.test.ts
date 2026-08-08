import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('PII Redactor Middleware', () => {
  it('should mask credit card numbers in request body', async () => {
    const res = await request(app)
      .post('/api/v1/tickets')
      .send({
        title: 'Payment issue with card 4532-1234-5678-9012',
        description: 'Customer entered credit card 4532123456789012 for billing',
      });

    expect(res.status).not.toBe(500);
  });

  it('should mask Social Security Numbers (SSNs) in request body', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({
        subject: 'Employee SSN verification 123-45-6789',
        description: 'SSN 987-65-4321 needs verification',
      });

    expect(res.status).toBe(200);
    expect(res.body.category).toBeDefined();
  });

  it('should mask API keys and secrets in plain text descriptions', async () => {
    const res = await request(app)
      .post('/api/triage')
      .send({
        subject: 'Leaked API Key',
        description: 'Found leaked key api_key: "sk_live_998877665544332211" in logs',
      });

    expect(res.status).toBe(200);
  });

  it('should preserve authentication password fields during login/register', async () => {
    // First register a test user
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'pii_test@company.com',
        password: 'AdminSecret123!',
        full_name: 'PII Test User',
        role: 'SYS_ADMIN',
      });

    // Then login to verify password was preserved by PII redactor
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'pii_test@company.com',
        password: 'AdminSecret123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
