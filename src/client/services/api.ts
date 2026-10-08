import {
  Campus,
  Inspection,
  Issue,
  IssueAuditLog,
  DashboardStats,
  UserProfile,
  UserRole,
} from '../../shared/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Gets authentication and role headers from localStorage or session
 */
export function getAuthHeaders(): Record<string, string> {
  const currentRole = localStorage.getItem('visioncampus_active_role') || 'SAFETY_OFFICER';
  const currentUserId = localStorage.getItem('visioncampus_active_user_id') || '';
  const token = localStorage.getItem('visioncampus_token') || '';

  const headers: Record<string, string> = {
    'x-user-role': currentRole,
  };

  if (currentUserId) {
    headers['x-user-id'] = currentUserId;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const api = {
  // Locations
  async getHierarchy(): Promise<Campus[]> {
    const res = await fetch(`${API_BASE}/locations/hierarchy`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load location hierarchy');
    return res.json();
  },

  async createBuilding(data: { campusId: string; name: string; code: string; latitude?: number; longitude?: number }) {
    const res = await fetch(`${API_BASE}/locations/building`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create building');
    return res.json();
  },

  async createFloor(data: { buildingId: string; level: string }) {
    const res = await fetch(`${API_BASE}/locations/floor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create floor');
    return res.json();
  },

  async createArea(data: { floorId: string; name: string; roomNumber?: string }) {
    const res = await fetch(`${API_BASE}/locations/area`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create area');
    return res.json();
  },

  // Inspections
  async analyzeInspection(formData: FormData): Promise<{
    success: boolean;
    inspection: Inspection;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/inspections/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Inspection analysis failed');
    }
    return data;
  },

  async getInspections(params?: { status?: string; buildingId?: string }): Promise<Inspection[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.buildingId) query.append('buildingId', params.buildingId);

    const res = await fetch(`${API_BASE}/inspections?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load inspections');
    return res.json();
  },

  async getInspectionById(id: string): Promise<Inspection> {
    const res = await fetch(`${API_BASE}/inspections/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Inspection not found');
    return res.json();
  },

  // Issues
  async getIssues(params?: {
    status?: string;
    severity?: string;
    category?: string;
    assignedTo?: string;
  }): Promise<Issue[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.category) query.append('category', params.category);
    if (params?.assignedTo) query.append('assignedTo', params.assignedTo);

    const res = await fetch(`${API_BASE}/issues?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load issues');
    return res.json();
  },

  async getIssueById(id: string): Promise<{ issue: Issue; auditLogs: IssueAuditLog[] }> {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Issue record not found');
    return res.json();
  },

  async updateIssueStatus(
    id: string,
    data: { status: string; assigned_to?: string | null; comment?: string }
  ): Promise<{ success: boolean; issue: Issue }> {
    const res = await fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update issue');
    return result;
  },

  // Analytics & Users
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  },

  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load user directory');
    return res.json();
  },
};
