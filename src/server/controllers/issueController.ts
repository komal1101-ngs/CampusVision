import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { dbRepository } from '../services/dbService';
import { UpdateIssueStatusSchema } from '../../shared/schemas/inspectionSchema';

export const getIssues = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, severity, category, assignedTo } = req.query;
    const issues = await dbRepository.getIssues({
      status: status as string | undefined,
      severity: severity as string | undefined,
      category: category as string | undefined,
      assignedTo: assignedTo as string | undefined,
    });
    res.json(issues);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve issues', details: err?.message });
  }
};

export const getIssueById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await dbRepository.getIssueById(id);
    if (!result) {
      return res.status(404).json({ error: 'Issue record not found' });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve issue details', details: err?.message });
  }
};

export const updateIssueStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validation = UpdateIssueStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid issue update data',
        details: validation.error.format(),
      });
    }

    const { status, assigned_to, comment } = validation.data;
    const userId = req.user?.id || '22222222-2222-4222-8222-222222222222';

    const updated = await dbRepository.updateIssueStatus(
      id,
      userId,
      status,
      assigned_to,
      comment
    );

    if (!updated) {
      return res.status(404).json({ error: 'Issue not found for status update' });
    }

    res.json({
      success: true,
      issue: updated,
      message: `Issue lifecycle transitioned to ${status}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update issue status', details: err?.message });
  }
};

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await dbRepository.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate dashboard metrics', details: err?.message });
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profiles = await dbRepository.getAllProfiles();
    res.json(profiles);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve users', details: err?.message });
  }
};
