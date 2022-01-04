import { decode } from 'jsonwebtoken';
import setCookie from 'set-cookie-parser';
import request from 'supertest';

import app from '../../app';
import { UserService } from '../../services';
import * as service from '../../services/verifyMobile.service';
import { fakerPhoneGen } from '../../testHelpers';

beforeEach(async () => {
  const mockedStart = jest.spyOn(service, 'startVerification');
  const mockedCheck = jest.spyOn(service, 'checkVerification');

  mockedStart.mockResolvedValue({ status: 'success' });
  mockedCheck.mockResolvedValue({ status: 'success' });
});

describe('POST api/auth/signup', () => {
  describe('signup then log in with a valid token', () => {
    it('returns 200, token and Info', async () => {
      const build = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ mobile: build.mobile, region: build.region })
        .expect(200);

      const returned = response.body;

      expect(returned.mobile).toBe(build.mobile);
      expect(returned.verifiedMobile).toBe(false);

      const verifyRequest = {
        mobile: build.mobile,
        code: '123456',
      };

      const verified = await request(app)
        .post('/api/auth/verify')
        .send(verifyRequest)
        .set('Accept', 'application/json')
        .expect(200);

      const { body, headers } = verified;

      const cookie = setCookie.parse(headers['set-cookie'], {
        decodeValues: true,
        map: true,
      });

      expect(cookie.accessToken.httpOnly).toBe(true);
      expect(cookie.accessToken.expires).toBeDefined;

      const accessToken = cookie.accessToken.value;

      const payload = decode(accessToken, {
        complete: true,
      })?.payload;

      const now = new Date().getSeconds();

      expect(payload?.mobile).toBe(build.mobile);
      expect(payload?.verifiedMobile).toBe(true);
      expect(payload?.aud).toBe('myPhone');
      expect(payload?.roles[0]).toBe('user');
      expect(payload?.exp).toBeGreaterThan(now);

      expect(body.verifiedMobile).toBe(true);

      await request(app)
        .get('/api/user')
        .set('Cookie', `accessToken=${accessToken}`)
        .set('Authorization', accessToken)
        .send()
        .expect(200);
    });
  });

  describe('invalid token to GET /user', () => {
    it('returns a 401 forbidden', async () => {
      const newUser = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };

      await request(app).post('/api/auth/signup').send(newUser).expect(200);

      await request(app)
        .get('/api/user')
        .set('Authorization', 'sldkfj')
        .expect(401);
    });
  });

  describe('email already has an account', () => {
    const newUser = {
      mobile: fakerPhoneGen(),
      region: 'US',
    };
    const message = 'User Already Exists. Please Sign In';

    // TODO: make this test logging in the person instead
    xit('returns 409 with notification', async () => {
      await request(app).post('/api/auth/signup').send(newUser).expect(200);

      const response = await request(app)
        .post('/api/auth/signup')
        .send(newUser)
        .expect(409);

      expect(response.body).toBe(message);
    });
  });
});

describe('POST NEW /api/auth/signin', () => {
  describe('with correct creds', () => {
    it('creates a new token and logs in user', async () => {
      const build = {
        mobile: fakerPhoneGen(),
        region: 'US',
        verifiedMobile: true,
      };

      await UserService.create(build);

      const response = await request(app)
        .post('/api/auth/signin')
        .send({ mobile: build.mobile, region: 'US' })
        .expect(200);

      const { headers } = response;

      const cookie = setCookie.parse(headers['set-cookie'], {
        decodeValues: true,
        map: true,
      });

      expect(cookie.accessToken.httpOnly).toBe(true);
      expect(cookie.accessToken.expires).toBeDefined;

      const accessToken = cookie.accessToken.value;

      const payload = decode(accessToken, {
        complete: true,
      })?.payload;

      expect(payload?.mobile).toBe(build.mobile);

      await request(app)
        .get('/api/user')
        .set('Cookie', `accessToken=${accessToken}`)
        .set('Authorization', accessToken)
        .send()
        .expect(200);
    });
  });
});

// Expired Token
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2t0cmtiNTI5MDAwMjhkbG9jaG9scHlnbSIsImVtYWlsIjoiZGF2aWR0aG9tYXNvbjAwQGdtYWlsLmNvbSIsImlhdCI6MTYzMjExMjAzNiwiZXhwIjoxNjMyMTE5MjM2fQ.so4moVGWBouIMNQhtTbijGXheXfcJxTZjb8E-RHhMSE"

// TODO: determine if any of this is necessary by researching how refreshing tokens works
// describe('valid token');
// describe('invalid token');
// describe('expired token');
// describe('token renewal request');
