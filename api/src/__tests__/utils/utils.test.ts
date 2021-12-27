import { formatPhoneNumber } from '../../utils/utils';

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
