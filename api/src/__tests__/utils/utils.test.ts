import PhoneNumber from 'awesome-phonenumber';
import faker from 'faker';

import { phoneGen } from '../../testHelpers';
import { formatPhoneNumber } from '../../utils/utils';

beforeEach(() => {
  jest.resetModules();
});

describe('Phone Number Testing', () => {
  test("'type === e164' formats correctly", () => {
    expect(formatPhoneNumber('9994043492', 'e164')).toBe('+19994043492');
    expect(formatPhoneNumber('12125551212', 'e164')).toBe('+12125551212');
    expect(formatPhoneNumber('+1-212-555-1212', 'e164')).toBe('+12125551212');
    expect(formatPhoneNumber('1 212 555 1212', 'e164')).toBe('+12125551212');
    expect(formatPhoneNumber('+1 (212) 555-1212', 'e164')).toBe('+12125551212');
  });

  test("'type === mobile' formats correctly", () => {
    expect(formatPhoneNumber('9994043492', 'mobile')).toBe('9994043492');
    expect(formatPhoneNumber('12125551212', 'mobile')).toBe('2125551212');
    expect(formatPhoneNumber('+1-212-555-1212', 'mobile')).toBe('2125551212');
    expect(formatPhoneNumber('1 212 555 1212', 'mobile')).toBe('2125551212');
    expect(formatPhoneNumber('+1 (212) 555-1212', 'mobile')).toBe('2125551212');
    expect(formatPhoneNumber('1234567891012', 'mobile')).toBe('4567891012');
  });
});

describe('Phone Number Generater', () => {
  // This is really just a reference for when I'm needing
  // to add or change the phoneGen() method I built for testing.
  // It's not really testing anything I built per-say.
  test('validity of awesome-phonenumber and phoneGen', async () => {
    // defaults to mobile
    const example = phoneGen();

    const mobile = example.getNumber();

    const extractedRegion = PhoneNumber(mobile).getRegionCode();
    const extractedCode = PhoneNumber(mobile).getCountryCode();
    const extractedNumber = PhoneNumber(mobile).getNumber('significant');
    const isValid = PhoneNumber(mobile).isValid();

    expect(extractedRegion).toBe(example.getRegionCode());
    expect(extractedCode).toBe(example.getCountryCode());
    expect(mobile).toBe(`+${example.getCountryCode()}${extractedNumber}`);
    expect(isValid).toBe(true);
  });

  test('faker generate proper phone format', () => {
    const base = faker.phone.phoneNumberFormat(2);

    const formatted = PhoneNumber(base, 'US');

    const number = formatted.getNumber();

    expect(number.length).toBe(12);
    expect(number.includes('+1')).toBe(true);
  });
});
