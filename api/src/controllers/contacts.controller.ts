import { Request, Response } from 'express';

import { router } from '../routes';
import { ContactService } from '../services';

export class ContactsController {
  public path = '/contacts';
  public router = router;

  static async list(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body.user;

      const list = await ContactService.getUserContacts(id);

      res.status(200).json(list);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async create(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.body.user;
      const contactList = req.body.contacts;

      const response = await ContactService.addContacts(id, contactList);

      res.status(201).json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
