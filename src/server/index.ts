import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PORT, MAX_FILE_SIZE_BYTES } from './config/constants';
import { requireAuth, requireRole } from './middleware/authMiddleware';
import { inspectionAnalyzeLimiter } from './middleware/rateLimiter';
import {
  getHierarchy,
  createBuilding,
  createFloor,
  createArea,
} from './controllers/locationController';
import {
  analyzeInspection,
  getInspections,
  getInspectionById,
} from './controllers/inspectionController';
import {
  getIssues,
  getIssueById,
  updateIssueStatus,
  getDashboardStats,
  getUsers,
} from './controllers/issueController';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-id'],
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Multer memory storage configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES, // 10MB
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VisionCampus API Server',
    timestamp: new Date().toISOString(),
  });
});

// 1. Locations routes
app.get('/api/locations/hierarchy', requireAuth, getHierarchy);
app.post(
  '/api/locations/building',
  requireAuth,
  requireRole(['ADMIN']),
  createBuilding
);
app.post(
  '/api/locations/floor',
  requireAuth,
  requireRole(['ADMIN']),
  createFloor
);
app.post(
  '/api/locations/area',
  requireAuth,
  requireRole(['ADMIN']),
  createArea
);

// 2. Inspection routes
app.post(
  '/api/inspections/analyze',
  inspectionAnalyzeLimiter,
  upload.single('image'),
  requireAuth,
  analyzeInspection
);
app.get('/api/inspections', requireAuth, getInspections);
app.get('/api/inspections/:id', requireAuth, getInspectionById);

// 3. Issues & lifecycle routes
app.get('/api/issues', requireAuth, getIssues);
app.get('/api/issues/:id', requireAuth, getIssueById);
app.patch(
  '/api/issues/:id/status',
  requireAuth,
  requireRole(['SAFETY_OFFICER', 'FACILITY_MANAGER', 'ADMIN']),
  updateIssueStatus
);

// 4. Analytics & Users
app.get('/api/dashboard/stats', requireAuth, getDashboardStats);
app.get('/api/users', requireAuth, getUsers);

// Start server — bind to 0.0.0.0 so Render can route external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[VisionCampus Server] Running on http://0.0.0.0:${PORT}`);
  console.log(`[VisionCampus Server] Ready for AI Visual Inspection requests.`);
});

export default app;
