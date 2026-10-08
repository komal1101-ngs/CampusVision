import { z } from 'zod';

export const IssueCategoryEnum = z.enum([
  'SAFETY',
  'ACCESSIBILITY',
  'INFRASTRUCTURE',
  'CROWD_OPERATIONAL',
]);

export const SeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const OverallStatusEnum = z.enum(['SAFE', 'ISSUES_FOUND', 'REVIEW_REQUIRED']);

export const IssueStatusEnum = z.enum([
  'NEW',
  'REVIEWED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]);

export const DetectedIssueSchema = z.object({
  category: IssueCategoryEnum,
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  severity: SeverityEnum,
  confidence: z.number().min(0.0).max(1.0),
  evidence: z.string().min(5),
  recommended_action: z.string().min(10),
});

export const AIIssueAnalysisResponseSchema = z.object({
  inspection_summary: z.string().min(10),
  overall_status: OverallStatusEnum,
  issues: z.array(DetectedIssueSchema),
});

export const CreateInspectionRequestSchema = z.object({
  campus_id: z.string().uuid(),
  building_id: z.string().uuid(),
  floor_id: z.string().uuid(),
  area_id: z.string().uuid(),
});

export const UpdateIssueStatusSchema = z.object({
  status: IssueStatusEnum,
  assigned_to: z.string().uuid().optional().nullable(),
  comment: z.string().max(500).optional(),
});

export type AIIssueAnalysisResponse = z.infer<typeof AIIssueAnalysisResponseSchema>;
export type DetectedIssue = z.infer<typeof DetectedIssueSchema>;
export type CreateInspectionRequest = z.infer<typeof CreateInspectionRequestSchema>;
export type UpdateIssueStatusRequest = z.infer<typeof UpdateIssueStatusSchema>;
