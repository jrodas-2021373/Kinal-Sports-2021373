import { Router } from 'express';
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  changeFieldStatus,
} from './field.controller.js';
import {
  validateCreateField,
  validateUpdateFieldRequest,
  validateFieldStatusChange,
  validateGetFieldById,
} from '../../middlewares/field-validators.js';
import { uploadFieldImage } from '../../middlewares/file-uploader.js';
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js';
import { requireRole } from '../../middlewares/validate-role.js';

const router = Router();

// Rutas GET - Accesibles públicamente
router.get('/', getFields);
router.get('/:id', validateGetFieldById, getFieldById);

// Rutas POST - Solo para administradores
router.post(
  '/',
  uploadFieldImage.single('image'),
  cleanupUploadedFileOnFinish,
  validateCreateField,
  requireRole('ADMIN_ROLE'), // Validar rol antes de procesar archivos
  createField
);

// Rutas PUT - Solo para administradores
router.put(
  '/:id',
  uploadFieldImage.single('image'),
  cleanupUploadedFileOnFinish,
  validateUpdateFieldRequest,
  requireRole('ADMIN_ROLE'), // Validar rol antes de procesar archivos
  updateField
);

router.put(
  '/:id/activate',
  validateFieldStatusChange,
  requireRole('ADMIN_ROLE'),
  changeFieldStatus
);

router.put(
  '/:id/deactivate',
  validateFieldStatusChange,
  requireRole('ADMIN_ROLE'),
  changeFieldStatus
);

export default router;
