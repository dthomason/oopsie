import { Request, Response } from 'express';

import { logger } from '../lib';
import { router } from '../routes/routes';

export class Healthz {
  public path = '/healthz';
  public router = router;

  static async show(_: Request, res: Response): Promise<any> {
    try {
      const successMessage = 'Success!!';

      res.status(200);
      res.json(successMessage);
    } catch (e) {
      res.status(500);
      logger.error(e);
    }
  }
}
