import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { validateMagicBytes, generateSafeStoragePath, uploadImageAndGetSignedUrl } from '../services/storageService';
import { analyzeCampusImage } from '../services/aiService';
import { dbRepository } from '../services/dbService';
import { CreateInspectionRequestSchema } from '../../shared/schemas/inspectionSchema';

export const analyzeInspection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded. An inspection photograph is mandatory.' });
    }

    // Binary magic byte validation
    const magicByteCheck = validateMagicBytes(file.buffer);
    if (!magicByteCheck.isValid) {
      return res.status(400).json({
        error: 'Security Error: Invalid image signature. Uploaded file does not match approved JPEG, PNG, or WebP standards.',
      });
    }

    // Validate location IDs
    const validation = CreateInspectionRequestSchema.safeParse({
      campus_id: req.body.campus_id,
      building_id: req.body.building_id,
      floor_id: req.body.floor_id,
      area_id: req.body.area_id,
    });

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid location metadata parameters',
        details: validation.error.format(),
      });
    }

    const { campus_id, building_id, floor_id, area_id } = validation.data;

    // Retrieve human-readable location context strings
    const locationContext = await dbRepository.getLocationNames(area_id);

    // Securely upload image to storage bucket
    const storagePath = generateSafeStoragePath(file.originalname, file.mimetype);
    const { signedUrl } = await uploadImageAndGetSignedUrl(file.buffer, storagePath, file.mimetype);

    // Call server-side Multimodal Gemini AI SDK
    console.log(`[Inspection Controller] Analyzing image for ${locationContext.areaName}...`);
    const aiResult = await analyzeCampusImage(file.buffer, file.mimetype, locationContext);

    // Persist to database
    const userId = req.user?.id || '22222222-2222-4222-8222-222222222222';
    const { inspection, issues } = await dbRepository.createInspection({
      userId,
      campusId: campus_id,
      buildingId: building_id,
      floorId: floor_id,
      areaId: area_id,
      imageUrl: signedUrl,
      storagePath,
      overallStatus: aiResult.overall_status,
      inspectionSummary: aiResult.inspection_summary,
      rawAiResponse: aiResult,
      detectedIssues: aiResult.issues,
    });

    return res.status(201).json({
      success: true,
      inspection: {
        ...inspection,
        issues,
      },
      message: 'Visual inspection completed and stored successfully.',
    });
  } catch (err: any) {
    console.error('[Inspection Controller] Analysis failure:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred during visual inspection analysis',
      details: err?.message,
    });
  }
};

export const getInspections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, buildingId } = req.query;
    const inspections = await dbRepository.getInspections({
      status: status as string | undefined,
      buildingId: buildingId as string | undefined,
    });
    res.json(inspections);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve inspections', details: err?.message });
  }
};

export const getInspectionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const inspection = await dbRepository.getInspectionById(id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve inspection details', details: err?.message });
  }
};
