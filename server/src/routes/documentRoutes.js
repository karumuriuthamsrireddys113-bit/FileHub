import express from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats
} from '../controllers/documentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect ALL document endpoints with authentication
router.use(authenticateUser);

// Stats route must be defined BEFORE /:id parameter route
router.get('/stats', getDocumentStats);

// Document CRUD routes (all scoped to authenticated user)
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;
