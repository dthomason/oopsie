import { Request, Response } from 'express';

import { router } from '../routes/routes';
import { UserService } from '../services';
import { log, to } from '../utils';

export class UserController {
  public path = ':id';
  public router = router;

  static async show(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body.user;

      const [user, err] = await to(UserService.findById(id));

      if (err) log(err, 'Get Show');

      res.status(200).json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async put(req: Request, res: Response): Promise<any> {
    try {
      // These two lines can be combined
      const { id } = req.body.user;
      const { update } = req.body;

      console.log({ id, update });

      const [user, err] = await to(UserService.update(id, update));

      if (err) log(err, 'Put');

      res.status(200).json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
