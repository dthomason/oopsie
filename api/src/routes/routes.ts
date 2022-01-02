import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  ContactsController,
  VoiceController,
  Healthz,
  UserController,
  AuthController,
} from '../controllers';
import { verifyToken } from '../middleware';

export const router = Router();

router.get('/healthz', (_, res) => Healthz.show(_, res));

router.post(
  '/refresh',
  verifyToken,
  asyncHandler(async (req, res) => AuthController.refresh(req, res)),
);

// TODO: Combine these next two into one conditional,
// if user doesn't exist we create them
// if they do exist we log them in
router.post(
  '/user',
  asyncHandler(async (req, res) => UserController.create(req, res)),
);

router.post(
  '/user/signin',
  asyncHandler(async (req, res) => UserController.signIn(req, res)),
);

router.post(
  '/user/verify',
  asyncHandler(async (req, res) => UserController.verify(req, res)),
);

router.get(
  '/user',
  verifyToken,
  asyncHandler(async (req, res) => UserController.show(req, res)),
);

router.get(
  '/contacts',
  verifyToken,
  asyncHandler(async (req, res) => ContactsController.list(req, res)),
);

router.post(
  '/contacts',
  verifyToken,
  asyncHandler(async (req, res) => ContactsController.create(req, res)),
);

router.post(
  '/voice/gather',
  asyncHandler(async (req, res) => VoiceController.gather(req, res)),
);
router.post(
  '/voice/gather/:id',
  asyncHandler(async (req, res) => VoiceController.gather(req, res)),
);
router.post(
  '/voice/lookup',
  asyncHandler(async (req, res) => VoiceController.lookup(req, res)),
);
router.post(
  '/voice/lookup/:id',
  asyncHandler(async (req, res) => VoiceController.lookup(req, res)),
);
router.post(
  '/voice/error',
  asyncHandler(async (req, res) => VoiceController.error(req, res)),
);
router.post(
  '/voice/error/:id',
  asyncHandler(async (req, res) => VoiceController.error(req, res)),
);
