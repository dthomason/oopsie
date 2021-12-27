import { Contact } from '@prisma/client';
import { compare } from 'bcrypt';

import { formatName } from '../utils';

import { ContactService } from './contact.service';
import { UserService } from './user.service';

export interface ConfiguredResponse {
  contacts: Contact[];
  script: string;
}
export interface Config {
  active: string;
  finishOnKey: string;
  input: string[];
  method: string;
  speechModel: string;
  speechTimeout: string;
  timeout: number;
}

const gather = {
  finishOnKey: '#',
  input: ['dtmf', 'speech'],
  method: 'POST',
  numDigits: 11,
  speechModel: 'numbers_and_commands',
  speechTimeout: 'auto',
  timeout: 3,
};

export class VoiceService {
  static async gather(req: Record<string, any>): Promise<Config | any> {
    enum Gather {
      Name = 'name',
      Number = 'number',
      Pin = 'pin',
    }

    const status = req.query ? req.query.type : '';

    if (status === Gather.Name) {
      const id = req.params.id ? req.params.id : '';

      const contacts = await ContactService.getUserContacts(id);
      const hints = contacts.map(({ firstName }) => firstName).join(', ');

      const config = {
        ...gather,
        action: `/api/voice/lookup/${id}?type=name`,
        hints: hints,
      };

      const script = 'Say the name of who you are needing to reach';

      return { config, script };
    }

    if (status === Gather.Pin) {
      const id = req.params.id ? req.params.id : '';

      const config = {
        ...gather,
        action: `/api/voice/lookup/${id}?type=pin`,
        pin: 4,
      };

      const script =
        'please enter your 4 digit pin number followed by the pound key';

      return { config, script };
    }

    // Greeting
    const config = {
      ...gather,
      action: '/api/voice/lookup?type=number',
    };
    const script =
      'Hi, please enter your mobile number including area code finished by the pound key';

    return { config, script };
  }

  // TODO: build better response types with a default so we always know the possible return
  static async error(req: Record<string, any>): Promise<Config | any> {
    enum ErrorType {
      Name = 'name',
      Number = 'number',
      Pin = 'pin',
    }

    const status = req.query ? req.query.type : '';

    if (status === ErrorType.Pin) {
      const pin = req.query ? req.query.pin : '';
      const id = req.params ? req.params.id : '';

      const config = {
        ...gather,
        action: `/api/voice/lookup/${id}?type=pin`,
      };
      const script = `Sorry, the number ${pin} was not found.  Please enter it again`;

      return { config, script };
    }

    if (status === ErrorType.Number) {
      const mobile = req.query ? req.query.mobile : '';
      const config = {
        ...gather,
        action: '/api/voice/lookup?type=number',
      };
      const script = `Sorry, the number ${mobile} was not found.  Please enter it again`;

      return { config, script };
    }

    if (status === ErrorType.Name) {
      const id = req.params ? req.params.id : '';

      const config = {
        ...gather,
        action: `/api/voice/lookup/${id}?type=name`,
      };
      const script =
        'Sorry I could not find anybody by that name, please try again';

      return { config, script };
    }
  }

  static async lookupPhone(mobile: string): Promise<string> {
    const verified = await UserService.findByPhone(mobile);

    if (verified) return `/api/voice/gather/${verified.id}?type=pin`;

    return `/api/voice/error?type=number&mobile=${mobile}`;
  }

  static async lookupPin(id: string, pin: string): Promise<string> {
    const found = await UserService.findPinById(id);

    if (found) {
      const matchPin = await compare(pin, found.pin);

      if (matchPin) return `/api/voice/gather/${id}?type=name`;
    }

    return `/api/voice/error/${id}?type=pin`;
  }

  static async lookupName(id: string, name: string): Promise<any> {
    const contacts = await ContactService.getUserContacts(id);
    const cleaned = formatName(name);

    const exact = contacts.filter(contact => contact.firstName === cleaned);

    if (exact.length)
      return {
        contacts: exact,
        say: 'We have found your exact contact',
        redirect: exact[0].phoneNumbers[0].number,
      };

    const contains = contacts.filter(contact =>
      contact.firstName.includes(cleaned),
    );

    if (contains.length)
      return {
        contacts: contains,
        say: 'We have found your contains contact',
        redirect: contains[0].phoneNumbers[0].number,
      };

    return {
      contacts: [],
      say: '',
      redirect: `/api/voice/error/${id}?type=name`,
    };
  }
}
