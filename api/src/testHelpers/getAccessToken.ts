import setCookie from 'set-cookie-parser';

export const getAccessToken = (headers: any) => {
  const accessToken = setCookie.parse(headers['set-cookie'], {
    decodeValues: true,
    map: true,
  }).accessToken.value;

  return accessToken;
};
