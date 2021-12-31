import { decode } from 'jsonwebtoken';
import setCookie from 'set-cookie-parser';
import request from 'supertest';

import app from '../../app';
import { UserService } from '../../services';
import * as service from '../../services/verifyMobile.service';
import { userBuilder } from '../../testHelpers';
import { formatPhoneNumber } from '../../utils';

beforeEach(async () => {
  const mockedStart = jest.spyOn(service, 'startVerification');
  const mockedCheck = jest.spyOn(service, 'checkVerification');

  mockedStart.mockResolvedValue({ status: 'success' });
  mockedCheck.mockResolvedValue({ status: 'success' });
});

describe('POST api/user', () => {
  describe('Creating an account', () => {
    it('returns 200, token and Info', async () => {
      const newUser = userBuilder();
      const response = await request(app)
        .post('/api/user')
        .send(newUser)
        .expect(200);

      const returned = response.body;

      expect(returned.mobile).toBe(formatPhoneNumber(newUser.mobile));
      expect(returned.verifiedMobile).toBe(false);
      expect(response.body.pin).toBeUndefined();

      const verifyRequest = {
        mobile: newUser.mobile,
        code: '123456',
      };

      const verified = await request(app)
        .post('/api/user/verify')
        .send(verifyRequest)
        .set('Accept', 'application/json')
        .expect(200);

      const { body, headers } = verified;

      const cookie = setCookie.parse(headers['set-cookie'], {
        decodeValues: true,
        map: true,
      });

      expect(cookie.accessToken.httpOnly).toBe(true);

      const accessToken = cookie.accessToken.value;

      const payload = decode(accessToken, {
        complete: true,
      })?.payload;

      const now = new Date().getSeconds();

      expect(payload?.mobile).toBe(formatPhoneNumber(newUser.mobile));
      expect(payload?.verifiedMobile).toBe(true);
      expect(payload?.aud).toBe('oopsie-auth');
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
      const newUser = userBuilder();

      await request(app).post('/api/user').send(newUser).expect(200);

      await request(app)
        .get('/api/user')
        .set('Authorization', 'sldkfj')
        .expect(401);
    });
  });

  describe('email already has an account', () => {
    const newUser = userBuilder();
    const message = 'User Already Exists. Please Sign In';

    it('returns 409 with notification', async () => {
      await request(app).post('/api/user').send(newUser).expect(200);

      const response = await request(app)
        .post('/api/user')
        .send(newUser)
        .expect(409);

      expect(response.body).toBe(message);
    });
  });
});

describe('POST /api/user/signin', () => {
  describe('with correct creds', () => {
    it('creates a new token and logs in user', async () => {
      const newUser = {
        ...userBuilder(),
        verifiedMobile: true,
      };

      await UserService.create({
        ...newUser,
      });

      const response = await request(app)
        .post('/api/user/signin')
        .send({ mobile: newUser.mobile, pin: newUser.pin })
        .expect(200);

      const { headers } = response;

      const cookie = setCookie.parse(headers['set-cookie'], {
        decodeValues: true,
        map: true,
      });

      expect(cookie.accessToken.httpOnly).toBe(true);

      const accessToken = cookie.accessToken.value;

      const payload = decode(accessToken, {
        complete: true,
      })?.payload;

      expect(payload?.mobile).toBe(formatPhoneNumber(newUser.mobile));

      await request(app)
        .get('/api/user')
        .set('Cookie', `accessToken=${accessToken}`)
        .set('Authorization', accessToken)
        .send()
        .expect(200);
    });
  });

  describe('missing password', () => {
    it('returns back a 400', async () => {
      const newUser = userBuilder();

      await request(app).post('/api/user').send(newUser).expect(200);

      await request(app)
        .post('/api/user')
        .type('form')
        .send({ mobile: newUser.mobile })
        .expect(400);
    });
  });

  describe('incorrect creds', () => {
    const user = userBuilder();
    const message = 'Account not Found';

    it('returns 400 with message', async () => {
      await request(app).post('/api/user').send(user).expect(200);

      const credentials = { mobile: '5553332222', pin: '4321' };
      const response = await request(app)
        .post('/api/user/signin')
        .send(credentials)
        .expect(400);

      expect(response.body).toBe(message);
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
