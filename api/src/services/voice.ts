import { compare } from 'bcrypt';
import { Request } from 'express';
import VoiceResponse, {
  GatherAttributes,
} from 'twilio/lib/twiml/VoiceResponse';

import { formatPhoneNumber, formatPin } from '../utils';

import { ContactService } from './contact.service';
import { UserService } from './user.service';
import { dialog, findNameMatch } from './utils';

const gatherConfig: GatherAttributes = {
  action: '',
  finishOnKey: '#',
  input: ['dtmf', 'speech'],
  method: 'POST',
  numDigits: 11,
  speechModel: 'numbers_and_commands',
  speechTimeout: 'auto',
  timeout: 3,
};

export type CallFlowStatus = 'number' | 'pin' | 'name';

interface VoiceServiceResponse {
  config: GatherAttributes;
  script: string;
}

// Run this project through Code Climate for a lot of readability feedback

const gather = async (req: Request): Promise<VoiceServiceResponse> => {
  const status = req.query?.type || '';

  switch (status as CallFlowStatus) {
    case 'pin': {
      const { id } = req.params;

      const { action, script, numDigits } = dialog({ id }).gatherPin;

      const config: GatherAttributes = {
        ...gatherConfig,
        action,
        numDigits,
      };

      const op = new VoiceResponse();

      op.gather({ ...config }).say(script);

      return { config, script };
    }

    case 'name': {
      const { id } = req.params;

      const contacts = await ContactService.getUserContacts(id);
      const hints = contacts.map(({ firstName }) => firstName).join(', ');

      const { action, script } = dialog({ id }).gatherName;

      const config = {
        ...gatherConfig,
        action,
        hints,
      };

      return { config, script };
    }

    default: {
      const { action, script } = dialog().gatherNumber;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }
  }
};

const lookup = async (req: Request): Promise<VoiceServiceResponse> => {
  const status = req.query?.type;

  switch (status as CallFlowStatus) {
    case 'number': {
      const { Digits } = req.body;
      const found = await UserService.findByPhone(Digits);

      const args = {
        id: found.id,
        found: !!found,
        number: formatPhoneNumber(Digits),
      };
      const { action, script } = dialog(args).lookupNumber;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }

    case 'pin': {
      const { Digits } = req.body;
      const { id } = req.params;
      const found = await UserService.findPinById(id);
      const matchPin = await compare(formatPin(Digits), found.pin);

      const args = {
        id,
        found: !!matchPin,
      };

      const { action, script } = dialog(args).lookupPin;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }

    case 'name': {
      const { id } = req.params;
      const contacts = await ContactService.getUserContacts(id);
      const match = await findNameMatch(req.body.SpeechResult, contacts);
      const number = match?.phoneNumbers[0].number || '';

      const args = {
        id,
        found: !!match,
        number: formatPhoneNumber(number),
      };

      const { action, script } = dialog(args).lookupName;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }

    default: {
      const { action, script } = dialog().default;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }
  }
};

const error = async (req: Request): Promise<VoiceServiceResponse> => {
  const status = req.query.type;

  switch (status as CallFlowStatus) {
    case 'number': {
      const mobile = req.query.mobile?.toString() || '';

      const args = {
        number: formatPhoneNumber(mobile),
      };

      const { action, script } = dialog(args).errorNumber;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }

    case 'pin': {
      const id = req.params?.id || '';

      const args = {
        id,
      };

      const { action, script, numDigits } = dialog(args).errorPin;

      const config = {
        ...gatherConfig,
        numDigits,
        action,
      };

      return { config, script };
    }

    case 'name': {
      const { id } = req.params;

      const args = {
        id,
      };

      const { action, script } = dialog(args).errorName;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }

    default: {
      const { action, script } = dialog().default;

      const config = {
        ...gatherConfig,
        action,
      };

      return { config, script };
    }
  }
};

export const Voice = { error, gather, lookup };
