import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  AuthController,
  ContactsController,
  VoiceController,
  Healthz,
  UserController,
} from '../controllers';
import { verifyToken } from '../middleware';

export const router = Router();

router.get('/healthz', (_, res) => Healthz.show(_, res));

// This file can be DRY'd up big time

router.get(
  '/auth/refresh',
  verifyToken,
  asyncHandler(async (req, res) => AuthController.refresh(req, res)),
);
router.post(
  '/auth/signup',
  asyncHandler(async (req, res) => AuthController.signup(req, res)),
);
router.post(
  '/auth/signin',
  asyncHandler(async (req, res) => AuthController.signin(req, res)),
);
router.post(
  '/auth/verify',
  asyncHandler(async (req, res) => AuthController.verify(req, res)),
);

router.get(
  '/user',
  verifyToken,
  asyncHandler(async (req, res) => UserController.show(req, res)),
);

router.put(
  '/user',
  verifyToken,
  asyncHandler(async (req, res) => UserController.put(req, res)),
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
