import { Request, Response } from 'express';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

import { router } from '../routes';
import { Voice } from '../services';

export class VoiceController {
  public path = '/voice';
  public router = router;

  static async gather(req: Request, res: Response): Promise<any> {
    try {
      const op = new VoiceResponse();

      const { config, script } = await Voice.gather(req);

      op.gather({ ...config }).say(script);

      res.type('text/xml');
      res.send(op.toString());
      res.status(200);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async lookup(req: Request, res: Response): Promise<any> {
    try {
      const op = new VoiceResponse();

      const { config, script } = await Voice.lookup(req);

      if (config.action?.includes('redirect')) {
        const number = config.action.replace('redirect=', '');

        const dial = op.dial({
          callerId: process.env.TWILIO_NUMBER,
        });

        op.say(script);
        dial.number(number);
      } else {
        op.gather({ ...config }).say(script);
      }

      res.type('text/xml');
      res.send(op.toString());
      res.status(200);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async error(req: Request, res: Response): Promise<any> {
    try {
      const op = new VoiceResponse();

      const { config, script } = await Voice.error(req);

      op.gather({ ...config }).say(script);

      res.type('text/xml');
      res.send(op.toString());
      res.status(200);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
