export type UserRole = 'STUDENT' | 'TEACHER' | 'SAFETY_OFFICER' | 'FACILITY_MANAGER' | 'ADMIN';

export type OverallStatus = 'SAFE' | 'ISSUES_FOUND' | 'REVIEW_REQUIRED';

export type IssueCategory = 'SAFETY' | 'ACCESSIBILITY' | 'INFRASTRUCTURE' | 'CROWD_OPERATIONAL';

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 'NEW' | 'REVIEWED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Campus {
  id: string;
  name: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  buildings?: Building[];
}

export interface Building {
  id: string;
  campus_id: string;
  name: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  floors?: Floor[];
}

export interface Floor {
  id: string;
  building_id: string;
  level: string;
  sequence_order: number;
  created_at?: string;
  areas?: Area[];
}

export interface Area {
  id: string;
  floor_id: string;
  name: string;
  room_number?: string | null;
  created_at?: string;
}

export interface Inspection {
  id: string;
  user_id: string;
  campus_id: string;
  building_id: string;
  floor_id: string;
  area_id: string;
  image_url: string;
  storage_path: string;
  overall_status: OverallStatus;
  inspection_summary: string;
  raw_ai_response: Record<string, any>;
  created_at: string;
  // Joined fields
  user?: UserProfile;
  campus?: Campus;
  building?: Building;
  floor?: Floor;
  area?: Area;
  issues?: Issue[];
}

export interface Issue {
  id: string;
  inspection_id: string;
  area_id: string;
  category: IssueCategory;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  confidence_score: number;
  visual_evidence: string;
  recommended_action: string;
  assigned_to?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_user?: UserProfile;
  area?: Area;
  inspection?: Inspection;
}

export interface IssueAuditLog {
  id: string;
  issue_id: string;
  changed_by: string;
  previous_status: IssueStatus | null;
  new_status: IssueStatus;
  comment?: string | null;
  created_at: string;
  changer?: UserProfile;
}

export interface DashboardStats {
  totalInspections: number;
  totalIssues: number;
  openIssuesCount: number;
  criticalHazardsCount: number;
  resolvedIssuesPercentage: number;
  avgRemediationDays: number;
  severityBreakdown: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  categoryBreakdown: {
    SAFETY: number;
    ACCESSIBILITY: number;
    INFRASTRUCTURE: number;
    CROWD_OPERATIONAL: number;
  };
  buildingBreakdown: Array<{
    buildingName: string;
    low: number;
    medium: number;
    high: number;
    critical: number;
    total: number;
  }>;
  recentInspections: Inspection[];
  recentIssues: Issue[];
}
