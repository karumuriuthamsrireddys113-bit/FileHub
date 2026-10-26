import { getPrisma } from '../config/prisma.js';

// Allowed document categories
export const ALLOWED_CATEGORIES = ['College', 'Personal', 'Work', 'Finance', 'Other'];

// Allowed sorting fields
export const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'name'];

// Allowed sorting orders
export const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

// MongoDB ObjectId validation regex (24-character hexadecimal)
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 */
function isValidHttpUrl(string) {
  if (!string || typeof string !== 'string') return false;
  try {
    const parsed = new URL(string.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * GET /api/documents
 * List documents with server-side pagination, search, category filter, and sorting.
 * Strictly scoped to the authenticated user.
 */
export async function getDocuments(req, res, next) {
  try {
    const prisma = getPrisma();
    const userId = req.user.id;

    // 1. Pagination parameters
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    // 2. Search parameter
    const search = req.query.search ? String(req.query.search).trim() : '';

    // 3. Category filter
    const category = req.query.category ? String(req.query.category).trim() : '';

    // 4. Sorting parameters with safe whitelist
    const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const order = ALLOWED_SORT_ORDERS.includes(req.query.order) ? req.query.order : 'desc';

    // Construct Prisma where query scoped to authenticated user
    const where = {
      userId
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    if (category && category !== 'All' && ALLOWED_CATEGORIES.includes(category)) {
      where.category = category;
    }

    // Execute queries in parallel for optimal performance
    const [documents, totalDocuments] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order
        }
      }),
      prisma.document.count({ where })
    ]);

    const totalPages = Math.ceil(totalDocuments / limit) || 1;

    return res.status(200).json({
      success: true,
      data: documents,
      pagination: {
        page,
        limit,
        totalDocuments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/documents/:id
 * Retrieve a single document by ID, checking ownership.
 */
export async function getDocumentById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!OBJECT_ID_REGEX.test(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid document ID format or document not found'
      });
    }

    const prisma = getPrisma();
    const document = await prisma.document.findUnique({
      where: { id }
    });

    // Check document existence and ownership
    if (!document || (document.userId && document.userId !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/documents
 * Create a new document assigned to the authenticated user.
 */
export async function createDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, description, category, fileUrl } = req.body;
    const errors = {};

    // Validate name
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      errors.name = 'Document name is required';
    } else if (trimmedName.length > 150) {
      errors.name = 'Document name cannot exceed 150 characters';
    }

    // Validate category
    if (!category) {
      errors.category = 'Category is required';
    } else if (!ALLOWED_CATEGORIES.includes(category)) {
      errors.category = `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`;
    }

    // Validate fileUrl (optional, but must be valid if supplied)
    const trimmedUrl = typeof fileUrl === 'string' ? fileUrl.trim() : '';
    if (trimmedUrl && !isValidHttpUrl(trimmedUrl)) {
      errors.fileUrl = 'File URL must be a valid HTTP or HTTPS web address';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const prisma = getPrisma();
    const newDocument = await prisma.document.create({
      data: {
        name: trimmedName,
        description: description ? String(description).trim() : null,
        category,
        fileUrl: trimmedUrl || null,
        userId
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: newDocument
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/documents/:id
 * Update an existing document with ownership check and validation.
 */
export async function updateDocument(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!OBJECT_ID_REGEX.test(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid document ID format or document not found'
      });
    }

    const prisma = getPrisma();
    const existing = await prisma.document.findUnique({
      where: { id }
    });

    // Check existence and verify user is the document owner
    if (!existing || (existing.userId && existing.userId !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const { name, description, category, fileUrl } = req.body;
    const errors = {};

    // Validate name
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      errors.name = 'Document name is required';
    } else if (trimmedName.length > 150) {
      errors.name = 'Document name cannot exceed 150 characters';
    }

    // Validate category
    if (!category) {
      errors.category = 'Category is required';
    } else if (!ALLOWED_CATEGORIES.includes(category)) {
      errors.category = `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`;
    }

    // Validate fileUrl
    const trimmedUrl = typeof fileUrl === 'string' ? fileUrl.trim() : '';
    if (trimmedUrl && !isValidHttpUrl(trimmedUrl)) {
      errors.fileUrl = 'File URL must be a valid HTTP or HTTPS web address';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        name: trimmedName,
        description: description !== undefined ? (description ? String(description).trim() : null) : existing.description,
        category,
        fileUrl: trimmedUrl || null
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: updatedDocument
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/documents/:id
 * Delete a document by ID with ownership check.
 */
export async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!OBJECT_ID_REGEX.test(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid document ID format or document not found'
      });
    }

    const prisma = getPrisma();
    const existing = await prisma.document.findUnique({
      where: { id }
    });

    // Check existence and verify user is the document owner
    if (!existing || (existing.userId && existing.userId !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await prisma.document.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/documents/stats
 * Retrieve total document counts and category statistics strictly for the authenticated user.
 */
export async function getDocumentStats(req, res, next) {
  try {
    const prisma = getPrisma();
    const userId = req.user.id;

    // Execute total count and grouped counts strictly scoped to current user
    const [totalDocuments, groupedCategories] = await Promise.all([
      prisma.document.count({
        where: { userId }
      }),
      prisma.document.groupBy({
        by: ['category'],
        where: { userId },
        _count: {
          id: true
        }
      })
    ]);

    // Initialize all standard categories with 0 count
    const byCategory = {
      College: 0,
      Personal: 0,
      Work: 0,
      Finance: 0,
      Other: 0
    };

    // Populate actual counts from group by result
    groupedCategories.forEach((group) => {
      if (group.category in byCategory) {
        byCategory[group.category] = group._count.id;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalDocuments,
        byCategory
      }
    });
  } catch (error) {
    next(error);
  }
}
