import express from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats
} from '../controllers/documentController.js';

const router = express.Router();

// Stats route must be defined BEFORE /:id parameter route
router.get('/stats', getDocumentStats);

// Document CRUD routes
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;
