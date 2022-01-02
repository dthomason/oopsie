import { times } from 'lodash';
import request from 'supertest';

import app from '../../app';
import { UserService, ContactService } from '../../services';
import * as service from '../../services/verifyMobile.service';
import { userBuilder, contactBuilder } from '../../testHelpers/buildup';

beforeEach(async () => {
  const mockedStart = jest.spyOn(service, 'startVerification');
  const mockedCheck = jest.spyOn(service, 'checkVerification');

  mockedStart.mockResolvedValue({ status: 'success' });
  mockedCheck.mockResolvedValue({ status: 'success' });
});

const user = userBuilder();
const contacts = times(2).map(() => contactBuilder());

describe('VoiceController', () => {
  beforeAll(async () => {
    const created = await UserService.create(user);

    await ContactService.addContacts(created.id, contacts);
  });

  describe('#gather, caller number', () => {
    it('gathers the caller phone number', async () => {
      await UserService.findByMobile(user.mobile);

      const res = await request(app).post('/api/voice/gather').expect(200);

      expect(res.text).toContain('please enter your mobile number');
      expect(res.text).toContain('/api/voice/lookup?type=number');
    });
  });

  describe('#gather, caller pin', () => {
    it('is gathered and redirects correctly', async () => {
      const caller = await UserService.findByMobile(user.mobile);

      const res = await request(app)
        .post(`/api/voice/gather/${caller?.id}?type=pin`)
        .send()
        .expect(200);

      expect(res.text).toContain(`/api/voice/lookup/${caller?.id}?type=pin`);
      expect(res.text).toContain('please enter your 4 digit pin number');
    });
  });

  describe('#gather, caller contact', () => {
    it('gather name of contact user needs', async () => {
      const caller = await UserService.findByMobile(user.mobile);

      const res = await request(app)
        .post(`/api/voice/gather/${caller?.id}?type=name`)
        .send()
        .expect(200);

      expect(res.text).toContain(`/api/voice/lookup/${caller?.id}?type=name`);
    });
  });

  describe('#lookup, caller number', () => {
    it('is found and redirects correctly', async () => {
      const caller = await UserService.findByMobile(user.mobile);

      const res = await request(app)
        .post('/api/voice/lookup?type=number')
        .type('form')
        .send({ Digits: caller?.mobile })
        .expect(200);

      expect(res.text).toContain(`/api/voice/gather/${caller?.id}?type=pin`);
    });
  });

  describe('#lookup, caller pin', () => {
    it('is found and redirects correctly', async () => {
      const caller = await UserService.findByMobile(user.mobile);

      const res = await request(app)
        .post(`/api/voice/lookup/${caller?.id}?type=pin`)
        .type('form')
        .send({ Digits: '1234' })
        .expect(200);

      expect(res.text).toContain(`/api/voice/gather/${caller?.id}?type=name`);
    });
  });

  describe('#lookup, caller contact by name', () => {
    it('locates contact by name and dials', async () => {
      const caller = await UserService.findByMobile(user.mobile);
      const contacts = await ContactService.getUserContacts(
        caller ? caller.id : '',
      );
      const number = contacts[0].phoneNumbers[0].number;

      const res = await request(app)
        .post(`/api/voice/lookup/${caller?.id}?type=name`)
        .type('form')
        .send({ SpeechResult: contacts[0].firstName })
        .expect(200);

      expect(res.text).toContain(
        '<Say>We have found your contact, connecting you now',
      );
      expect(res.text).toContain(`<Number>${number}`);
    });
  });

  describe('#lookup, contains name', () => {
    it('locates contact by name and dials', async () => {
      const caller = await UserService.findByMobile(user.mobile);
      const contacts = await ContactService.getUserContacts(
        caller ? caller.id : '',
      );

      const nameLength = contacts[1].firstName.length;
      const newName = contacts[1].firstName.substring(0, nameLength - 2);
      const number = contacts[1].phoneNumbers[0].number;

      const res = await request(app)
        .post(`/api/voice/lookup/${caller?.id}?type=name`)
        .type('form')
        .send({ SpeechResult: newName })
        .expect(200);

      expect(res.text).toContain(
        '<Say>We have found your contact, connecting you now',
      );
      expect(res.text).toContain(`<Number>${number}`);
    });
  });

  describe('#lookup, special characters name', () => {
    it('locates contact by name and dials', async () => {
      const caller = await UserService.findByMobile(user.mobile);
      const contacts = await ContactService.getUserContacts(
        caller ? caller.id : '',
      );
      const number = contacts[1].phoneNumbers[0].number;

      const nameLength = contacts[1].firstName.length;
      const newName = contacts[1].firstName.substring(0, nameLength - 2);

      const res = await request(app)
        .post(`/api/voice/lookup/${caller?.id}?type=name`)
        .type('form')
        .send({ SpeechResult: newName + '.' })
        .expect(200);

      expect(res.text).toContain(
        '<Say>We have found your contact, connecting you now',
      );
      expect(res.text).toContain(number);
    });
  });

  describe('#error, caller mobile number', () => {
    it('repeats gathering the phone number', async () => {
      const number = '2092223333';
      const res = await request(app)
        .post(`/api/voice/error?type=number&mobile=${number}`)
        .send()
        .expect(200);

      expect(res.text).toContain(
        `Sorry, the number ${number} was not found.  Please enter it again`,
      );
      expect(res.text).toContain('/api/voice/lookup?type=number');
    });
  });

  describe('#error, caller pin number', () => {
    it('repeats gathering the phone number', async () => {
      const res = await request(app)
        .post(`/api/voice/error?type=number&mobile=${user.mobile}`)
        .send()
        .expect(200);

      expect(res.text).toContain(
        `Sorry, the number ${user.mobile} was not found.  Please enter it again`,
      );
      expect(res.text).toContain('/api/voice/lookup?type=number');
    });
  });

  describe('#error, caller find by spoken name', () => {
    it('repeats same gather once', async () => {
      const found = await UserService.findByMobile(user.mobile);

      const res = await request(app)
        .post(`/api/voice/error/${found.id}?type=name`)
        .send()
        .expect(200);

      expect(res.text).toContain(
        'Sorry I could not find anybody by that name, please try again',
      );
      expect(res.text).toContain(`/api/voice/lookup/${found.id}?type=name`);
    });
  });
});
