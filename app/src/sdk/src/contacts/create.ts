import { AxiosRequestConfig } from 'axios';

interface EmailAddress {
  label: string;
  email: string;
}

interface PhoneNumber {
  label: string;
  number: string;
}

export interface UserContact {
  firstName: string;
  lastName: string;
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  recordID: string;
}

interface CreateRequest {
  contacts: UserContact[];
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/contacts';
}

export type StoreContactsRequest = CreateRequest;

/**
 * POST `/api/contacts
 *
 * { contacts: UserContacts }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/contacts',
    body: data,
    data,
  } as const;
};
