import { supabaseAdmin } from '../lib/supabaseAdmin';
import {
  UserProfile,
  Campus,
  Building,
  Floor,
  Area,
  Inspection,
  Issue,
  IssueAuditLog,
  DashboardStats,
  IssueStatus,
  UserRole,
} from '../../shared/types';
import crypto from 'crypto';

// Seed IDs
export const CAMPUS_ID = 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';

// Buildings
export const BUILDING_MB_ID = 'b1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // Main Block
export const BUILDING_CMB_ID = 'b2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Civil & Mechanical Block
export const BUILDING_EEE_ID = 'b3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Electrical & Electronics Block
export const BUILDING_SAC_ID = 'b4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Student Activity Center & Canteen

// Floors
export const FLOOR_MB_G_ID = 'c1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // MB Ground Floor
export const FLOOR_MB_1_ID = 'c2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // MB Floor 1
export const FLOOR_CMB_G_ID = 'c3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // CMB Ground Floor
export const FLOOR_CMB_1_ID = 'c4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // CMB Floor 1
export const FLOOR_EEE_G_ID = 'c5b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // EEE Ground Floor
export const FLOOR_EEE_1_ID = 'c6b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // EEE Floor 1
export const FLOOR_SAC_G_ID = 'c7b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // SAC Ground Floor

// Areas
export const AREA_MB_G1_ID = 'd1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // Central Administrative Corridor
export const AREA_MB_G2_ID = 'd2b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // Main Entrance
export const AREA_MB_11_ID = 'd3b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // Dean Office Hallway
export const AREA_MB_12_ID = 'd4b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';  // Computer Labs Passageway

export const AREA_CMB_G1_ID = 'd5b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Heavy Machinery Lab Area
export const AREA_CMB_G2_ID = 'd6b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // East Exit Ramp
export const AREA_CMB_11_ID = 'd7b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Structural Engineering Corridor
export const AREA_CMB_12_ID = 'd8b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Emergency Stairwell

export const AREA_EEE_G1_ID = 'd9b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Power Systems Lab
export const AREA_EEE_G2_ID = 'da12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // High Voltage Bay Entrance
export const AREA_EEE_11_ID = 'db12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Electronics Workshop Corridor

export const AREA_SAC_G1_ID = 'dc12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Dining Area Pathway
export const AREA_SAC_G2_ID = 'dd12c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'; // Kitchen Egress Corridor

export const SEED_PROFILES: UserProfile[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'admin@gmrit.edu.in',
    full_name: 'Director Alex Vance',
    role: 'ADMIN',
    department: 'GMRIT Campus Operations & Administration',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'safety@gmrit.edu.in',
    full_name: 'Officer Marcus Reed',
    role: 'SAFETY_OFFICER',
    department: 'GMRIT Campus Safety & Compliance',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    email: 'facility@gmrit.edu.in',
    full_name: 'Manager Sarah Chen',
    role: 'FACILITY_MANAGER',
    department: 'GMRIT Infrastructure & Maintenance',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    email: 'faculty@gmrit.edu.in',
    full_name: 'Prof. David Miller',
    role: 'TEACHER',
    department: 'GMRIT Engineering Faculty',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    email: 'student@gmrit.edu.in',
    full_name: 'Jordan Taylor',
    role: 'STUDENT',
    department: 'GMRIT Student Council',
  },
];

export const SEED_AREAS: Area[] = [
  // Main Block (MB)
  { id: AREA_MB_G1_ID, floor_id: FLOOR_MB_G_ID, name: 'Central Administrative Corridor', room_number: 'MB-G01' },
  { id: AREA_MB_G2_ID, floor_id: FLOOR_MB_G_ID, name: 'Main Entrance', room_number: 'MB-MAIN' },
  { id: AREA_MB_11_ID, floor_id: FLOOR_MB_1_ID, name: 'Dean Office Hallway', room_number: 'MB-101' },
  { id: AREA_MB_12_ID, floor_id: FLOOR_MB_1_ID, name: 'Computer Labs Passageway', room_number: 'MB-LAB' },

  // Civil & Mechanical Block (CMB)
  { id: AREA_CMB_G1_ID, floor_id: FLOOR_CMB_G_ID, name: 'Heavy Machinery Lab Area', room_number: 'CMB-G02' },
  { id: AREA_CMB_G2_ID, floor_id: FLOOR_CMB_G_ID, name: 'East Exit Ramp', room_number: 'CMB-RAMP' },
  { id: AREA_CMB_11_ID, floor_id: FLOOR_CMB_1_ID, name: 'Structural Engineering Corridor', room_number: 'CMB-105' },
  { id: AREA_CMB_12_ID, floor_id: FLOOR_CMB_1_ID, name: 'Emergency Stairwell', room_number: 'CMB-STAIR' },

  // Electrical & Electronics Block (EEE)
  { id: AREA_EEE_G1_ID, floor_id: FLOOR_EEE_G_ID, name: 'Power Systems Lab', room_number: 'EEE-PSL' },
  { id: AREA_EEE_G2_ID, floor_id: FLOOR_EEE_G_ID, name: 'High Voltage Bay Entrance', room_number: 'EEE-HVB' },
  { id: AREA_EEE_11_ID, floor_id: FLOOR_EEE_1_ID, name: 'Electronics Workshop Corridor', room_number: 'EEE-108' },

  // Student Activity Center & Canteen (SAC)
  { id: AREA_SAC_G1_ID, floor_id: FLOOR_SAC_G_ID, name: 'Dining Area Pathway', room_number: 'SAC-DINE' },
  { id: AREA_SAC_G2_ID, floor_id: FLOOR_SAC_G_ID, name: 'Kitchen Egress Corridor', room_number: 'SAC-KITCH' },
];

export const SEED_FLOORS: Floor[] = [
  // Main Block (MB)
  {
    id: FLOOR_MB_G_ID,
    building_id: BUILDING_MB_ID,
    level: 'Ground Floor',
    sequence_order: 0,
    areas: [SEED_AREAS[0], SEED_AREAS[1]],
  },
  {
    id: FLOOR_MB_1_ID,
    building_id: BUILDING_MB_ID,
    level: 'Floor 1',
    sequence_order: 1,
    areas: [SEED_AREAS[2], SEED_AREAS[3]],
  },

  // Civil & Mechanical Block (CMB)
  {
    id: FLOOR_CMB_G_ID,
    building_id: BUILDING_CMB_ID,
    level: 'Ground Floor',
    sequence_order: 0,
    areas: [SEED_AREAS[4], SEED_AREAS[5]],
  },
  {
    id: FLOOR_CMB_1_ID,
    building_id: BUILDING_CMB_ID,
    level: 'Floor 1',
    sequence_order: 1,
    areas: [SEED_AREAS[6], SEED_AREAS[7]],
  },

  // Electrical & Electronics Block (EEE)
  {
    id: FLOOR_EEE_G_ID,
    building_id: BUILDING_EEE_ID,
    level: 'Ground Floor',
    sequence_order: 0,
    areas: [SEED_AREAS[8], SEED_AREAS[9]],
  },
  {
    id: FLOOR_EEE_1_ID,
    building_id: BUILDING_EEE_ID,
    level: 'Floor 1',
    sequence_order: 1,
    areas: [SEED_AREAS[10]],
  },

  // Student Activity Center & Canteen (SAC)
  {
    id: FLOOR_SAC_G_ID,
    building_id: BUILDING_SAC_ID,
    level: 'Ground Floor',
    sequence_order: 0,
    areas: [SEED_AREAS[11], SEED_AREAS[12]],
  },
];

export const SEED_BUILDINGS: Building[] = [
  {
    id: BUILDING_MB_ID,
    campus_id: CAMPUS_ID,
    name: 'Main Block',
    code: 'MB',
    latitude: 18.4678,
    longitude: 83.6601,
    floors: [SEED_FLOORS[0], SEED_FLOORS[1]],
  },
  {
    id: BUILDING_CMB_ID,
    campus_id: CAMPUS_ID,
    name: 'Civil & Mechanical Block',
    code: 'CMB',
    latitude: 18.4671,
    longitude: 83.6608,
    floors: [SEED_FLOORS[2], SEED_FLOORS[3]],
  },
  {
    id: BUILDING_EEE_ID,
    campus_id: CAMPUS_ID,
    name: 'Electrical & Electronics Block',
    code: 'EEE',
    latitude: 18.4682,
    longitude: 83.6596,
    floors: [SEED_FLOORS[4], SEED_FLOORS[5]],
  },
  {
    id: BUILDING_SAC_ID,
    campus_id: CAMPUS_ID,
    name: 'Student Activity Center & Canteen',
    code: 'SAC',
    latitude: 18.4665,
    longitude: 83.6612,
    floors: [SEED_FLOORS[6]],
  },
];

export const SEED_CAMPUSES: Campus[] = [
  {
    id: CAMPUS_ID,
    name: 'GMR Institute of Technology (GMRIT)',
    code: 'GMRIT-RAJAM',
    latitude: 18.4674,
    longitude: 83.6603,
    buildings: SEED_BUILDINGS,
  },
];

// Initial seeded inspections
const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'e1111111-1111-4111-8111-111111111111',
    user_id: SEED_PROFILES[1].id,
    campus_id: CAMPUS_ID,
    building_id: BUILDING_MB_ID,
    floor_id: FLOOR_MB_G_ID,
    area_id: AREA_MB_G1_ID,
    image_url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'inspections/gmrit-sample-1.jpg',
    overall_status: 'ISSUES_FOUND',
    inspection_summary: 'Visual inspection in GMRIT Main Block identified archive crates and maintenance materials stacked along the Central Administrative Corridor, obstructing the primary exit route.',
    raw_ai_response: {},
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    user: SEED_PROFILES[1],
  },
  {
    id: 'e2222222-2222-4222-8222-222222222222',
    user_id: SEED_PROFILES[0].id,
    campus_id: CAMPUS_ID,
    building_id: BUILDING_CMB_ID,
    floor_id: FLOOR_CMB_G_ID,
    area_id: AREA_CMB_G2_ID,
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'inspections/gmrit-sample-2.jpg',
    overall_status: 'ISSUES_FOUND',
    inspection_summary: 'East Exit Ramp at CMB obstructed by temporary fabrication stanchions and project demonstration banner stand.',
    raw_ai_response: {},
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    user: SEED_PROFILES[0],
  },
  {
    id: 'e3333333-3333-4333-8333-333333333333',
    user_id: SEED_PROFILES[2].id,
    campus_id: CAMPUS_ID,
    building_id: BUILDING_EEE_ID,
    floor_id: FLOOR_EEE_G_ID,
    area_id: AREA_EEE_G2_ID,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'inspections/gmrit-sample-3.jpg',
    overall_status: 'SAFE',
    inspection_summary: 'Routine facility audit in EEE Block: High Voltage Bay Entrance interlocks clear, fire extinguishers inspected, rubber safety mats compliant.',
    raw_ai_response: {},
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    user: SEED_PROFILES[2],
  },
];

// Initial seeded issues
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'f1111111-1111-4111-8111-111111111111',
    inspection_id: INITIAL_INSPECTIONS[0].id,
    area_id: AREA_MB_G1_ID,
    category: 'SAFETY',
    title: 'Storage Crates Restricting Central Admin Corridor Egress',
    description: 'Archive crates and materials stacked against the Main Block administrative corridor wall, reducing corridor egress width to under 32 inches.',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    confidence_score: 0.96,
    visual_evidence: 'Crates placed along designated emergency evacuation route in GMRIT Main Block Ground Floor.',
    recommended_action: 'Dispatch GMRIT facility crew to clear pathway obstructions to record storage room immediately.',
    assigned_to: SEED_PROFILES[2].id,
    created_at: INITIAL_INSPECTIONS[0].created_at,
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'f2222222-2222-4222-8222-222222222222',
    inspection_id: INITIAL_INSPECTIONS[1].id,
    area_id: AREA_CMB_G2_ID,
    category: 'ACCESSIBILITY',
    title: 'CMB East Exit Ramp Approach Obstructed',
    description: 'Temporary stanchions and advertising banners placed at the bottom ramp approach, violating universal accessibility clearance guidelines.',
    severity: 'HIGH',
    status: 'NEW',
    confidence_score: 0.93,
    visual_evidence: 'Stanchion bases constricting ramp turning radius to less than 48 inches at CMB Ground Floor ramp.',
    recommended_action: 'Relocate stanchions at least 6 feet away from the ramp slope transition point.',
    assigned_to: null,
    created_at: INITIAL_INSPECTIONS[1].created_at,
    updated_at: INITIAL_INSPECTIONS[1].created_at,
  },
  {
    id: 'f3333333-3333-4333-8333-333333333333',
    inspection_id: INITIAL_INSPECTIONS[0].id,
    area_id: AREA_MB_G1_ID,
    category: 'INFRASTRUCTURE',
    title: 'Damaged Exit Sign Housing in Main Block',
    description: 'Overhead illumination fixture shows cracked polycarbonate diffuser and loose mounting bracket near MB-G01.',
    severity: 'MEDIUM',
    status: 'REVIEWED',
    confidence_score: 0.89,
    visual_evidence: 'Exit signage fixture hanging unevenly with exposed wiring conduit edge.',
    recommended_action: 'Replace diffuser housing and tighten ceiling junction box anchors.',
    assigned_to: SEED_PROFILES[2].id,
    created_at: INITIAL_INSPECTIONS[0].created_at,
    updated_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'f4444444-4444-4444-8444-444444444444',
    inspection_id: INITIAL_INSPECTIONS[1].id,
    area_id: AREA_CMB_G2_ID,
    category: 'CROWD_OPERATIONAL',
    title: 'Corridor Choke Point During Lab Transit',
    description: 'Student workshop table setup constricting the main hallway outside Heavy Machinery Lab area into a single-file pinch point.',
    severity: 'LOW',
    status: 'RESOLVED',
    confidence_score: 0.87,
    visual_evidence: 'Folding table setup blocking 50% of the walking corridor span in CMB Ground Floor.',
    recommended_action: 'Move project display tables to the outdoor quad designated exhibition pavilion.',
    assigned_to: SEED_PROFILES[1].id,
    resolved_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

// Initial audit logs
const INITIAL_AUDIT_LOGS: IssueAuditLog[] = [
  {
    id: 'g1111111-1111-4111-8111-111111111111',
    issue_id: INITIAL_ISSUES[0].id,
    changed_by: SEED_PROFILES[0].id,
    previous_status: 'NEW',
    new_status: 'IN_PROGRESS',
    comment: 'Assigned to Facility Manager Sarah Chen. GMRIT Work order #GMRIT-8902 issued.',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'g2222222-2222-4222-8222-222222222222',
    issue_id: INITIAL_ISSUES[3].id,
    changed_by: SEED_PROFILES[1].id,
    previous_status: 'IN_PROGRESS',
    new_status: 'RESOLVED',
    comment: 'Exhibition tables relocated to courtyard. CMB Corridor completely cleared.',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

// Active repository store
class DatabaseRepository {
  private campuses: Campus[] = [...SEED_CAMPUSES];
  private buildings: Building[] = [...SEED_BUILDINGS];
  private floors: Floor[] = [...SEED_FLOORS];
  private areas: Area[] = [...SEED_AREAS];
  private profiles: UserProfile[] = [...SEED_PROFILES];
  private inspections: Inspection[] = [...INITIAL_INSPECTIONS];
  private issues: Issue[] = [...INITIAL_ISSUES];
  private auditLogs: IssueAuditLog[] = [...INITIAL_AUDIT_LOGS];

  async getLocationsHierarchy(): Promise<Campus[]> {
    try {
      const { data: dbCampuses, error } = await supabaseAdmin.from('campuses').select(`
        *,
        buildings:buildings (
          *,
          floors:floors (
            *,
            areas:areas (*)
          )
        )
      `);

      if (!error && dbCampuses && dbCampuses.length > 0) {
        return dbCampuses;
      }
    } catch {
      // Fallback
    }

    return this.campuses;
  }

  async getAllCampuses(): Promise<Campus[]> {
    return this.campuses;
  }

  async getAllBuildings(): Promise<Building[]> {
    return this.buildings;
  }

  async getAllFloors(): Promise<Floor[]> {
    return this.floors;
  }

  async getAllAreas(): Promise<Area[]> {
    return this.areas;
  }

  async getLocationNames(areaId: string): Promise<{
    campusName: string;
    buildingName: string;
    floorLevel: string;
    areaName: string;
  }> {
    const area = this.areas.find((a) => a.id === areaId);
    const floor = area ? this.floors.find((f) => f.id === area.floor_id) : null;
    const building = floor ? this.buildings.find((b) => b.id === floor.building_id) : null;
    const campus = building ? this.campuses.find((c) => c.id === building.campus_id) : null;

    return {
      campusName: campus?.name || 'GMR Institute of Technology (GMRIT)',
      buildingName: building?.name || 'Main Block',
      floorLevel: floor?.level || 'Ground Floor',
      areaName: area?.name || 'Central Administrative Corridor',
    };
  }

  async getProfileById(userId: string): Promise<UserProfile | null> {
    const profile = this.profiles.find((p) => p.id === userId);
    return profile || this.profiles[0];
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    return this.profiles;
  }

  async createInspection(inspectionData: {
    userId: string;
    campusId: string;
    buildingId: string;
    floorId: string;
    areaId: string;
    imageUrl: string;
    storagePath: string;
    overallStatus: 'SAFE' | 'ISSUES_FOUND' | 'REVIEW_REQUIRED';
    inspectionSummary: string;
    rawAiResponse: any;
    detectedIssues: Array<{
      category: 'SAFETY' | 'ACCESSIBILITY' | 'INFRASTRUCTURE' | 'CROWD_OPERATIONAL';
      title: string;
      description: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      confidence: number;
      evidence: string;
      recommended_action: string;
    }>;
  }): Promise<{ inspection: Inspection; issues: Issue[] }> {
    const inspectionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newInspection: Inspection = {
      id: inspectionId,
      user_id: inspectionData.userId,
      campus_id: inspectionData.campusId,
      building_id: inspectionData.buildingId,
      floor_id: inspectionData.floorId,
      area_id: inspectionData.areaId,
      image_url: inspectionData.imageUrl,
      storage_path: inspectionData.storagePath,
      overall_status: inspectionData.overallStatus,
      inspection_summary: inspectionData.inspectionSummary,
      raw_ai_response: inspectionData.rawAiResponse,
      created_at: now,
      user: await this.getProfileById(inspectionData.userId) || undefined,
    };

    // Insert detected issues
    const createdIssues: Issue[] = inspectionData.detectedIssues.map((issue) => {
      const issueId = crypto.randomUUID();
      return {
        id: issueId,
        inspection_id: inspectionId,
        area_id: inspectionData.areaId,
        category: issue.category,
        title: issue.title,
        description: issue.description,
        severity: issue.severity,
        status: 'NEW',
        confidence_score: issue.confidence,
        visual_evidence: issue.evidence,
        recommended_action: issue.recommended_action,
        assigned_to: null,
        created_at: now,
        updated_at: now,
      };
    });

    // Populate in memory
    this.inspections.unshift(newInspection);
    for (const iss of createdIssues) {
      this.issues.unshift(iss);
    }

    // Try saving to Supabase if tables exist
    try {
      await supabaseAdmin.from('inspections').insert({
        id: newInspection.id,
        user_id: newInspection.user_id,
        campus_id: newInspection.campus_id,
        building_id: newInspection.building_id,
        floor_id: newInspection.floor_id,
        area_id: newInspection.area_id,
        image_url: newInspection.image_url,
        storage_path: newInspection.storage_path,
        overall_status: newInspection.overall_status,
        inspection_summary: newInspection.inspection_summary,
        raw_ai_response: newInspection.raw_ai_response,
        created_at: newInspection.created_at,
      });

      if (createdIssues.length > 0) {
        await supabaseAdmin.from('issues').insert(
          createdIssues.map((iss) => ({
            id: iss.id,
            inspection_id: iss.inspection_id,
            area_id: iss.area_id,
            category: iss.category,
            title: iss.title,
            description: iss.description,
            severity: iss.severity,
            status: iss.status,
            confidence_score: iss.confidence_score,
            visual_evidence: iss.visual_evidence,
            recommended_action: iss.recommended_action,
            assigned_to: iss.assigned_to,
            created_at: iss.created_at,
            updated_at: iss.updated_at,
          }))
        );
      }
    } catch (err: any) {
      console.warn('[DB Repository] Supabase persistence note:', err?.message || err);
    }

    return { inspection: newInspection, issues: createdIssues };
  }

  async getInspections(filters?: {
    status?: string;
    buildingId?: string;
    limit?: number;
  }): Promise<Inspection[]> {
    let result = [...this.inspections];

    if (filters?.status) {
      result = result.filter((i) => i.overall_status === filters.status);
    }
    if (filters?.buildingId) {
      result = result.filter((i) => i.building_id === filters.buildingId);
    }

    return result.map((ins) => this.enrichInspection(ins));
  }

  async getInspectionById(id: string): Promise<Inspection | null> {
    const ins = this.inspections.find((i) => i.id === id);
    if (!ins) return null;
    return this.enrichInspection(ins);
  }

  private enrichInspection(ins: Inspection): Inspection {
    const area = this.areas.find((a) => a.id === ins.area_id);
    const floor = this.floors.find((f) => f.id === ins.floor_id);
    const building = this.buildings.find((b) => b.id === ins.building_id);
    const campus = this.campuses.find((c) => c.id === ins.campus_id);
    const issues = this.issues.filter((iss) => iss.inspection_id === ins.id);
    const user = this.profiles.find((p) => p.id === ins.user_id);

    return {
      ...ins,
      area,
      floor,
      building,
      campus,
      issues,
      user,
    };
  }

  async getIssues(filters?: {
    status?: string;
    severity?: string;
    category?: string;
    assignedTo?: string;
  }): Promise<Issue[]> {
    let result = [...this.issues];

    if (filters?.status) {
      result = result.filter((iss) => iss.status === filters.status);
    }
    if (filters?.severity) {
      result = result.filter((iss) => iss.severity === filters.severity);
    }
    if (filters?.category) {
      result = result.filter((iss) => iss.category === filters.category);
    }
    if (filters?.assignedTo) {
      result = result.filter((iss) => iss.assigned_to === filters.assignedTo);
    }

    return result.map((iss) => this.enrichIssue(iss));
  }

  async getIssueById(id: string): Promise<{ issue: Issue; auditLogs: IssueAuditLog[] } | null> {
    const issue = this.issues.find((i) => i.id === id);
    if (!issue) return null;

    const enriched = this.enrichIssue(issue);
    const logs = this.auditLogs
      .filter((l) => l.issue_id === id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((l) => ({
        ...l,
        changer: this.profiles.find((p) => p.id === l.changed_by),
      }));

    return { issue: enriched, auditLogs: logs };
  }

  private enrichIssue(iss: Issue): Issue {
    const assignedUser = iss.assigned_to
      ? this.profiles.find((p) => p.id === iss.assigned_to)
      : undefined;
    const area = this.areas.find((a) => a.id === iss.area_id);
    const inspection = this.inspections.find((i) => i.id === iss.inspection_id);

    return {
      ...iss,
      assigned_user: assignedUser,
      area,
      inspection,
    };
  }

  async updateIssueStatus(
    issueId: string,
    userId: string,
    newStatus: IssueStatus,
    assignedTo?: string | null,
    comment?: string
  ): Promise<Issue | null> {
    const issueIndex = this.issues.findIndex((i) => i.id === issueId);
    if (issueIndex === -1) return null;

    const previousStatus = this.issues[issueIndex].status;
    const now = new Date().toISOString();

    const updatedIssue: Issue = {
      ...this.issues[issueIndex],
      status: newStatus,
      updated_at: now,
      resolved_at: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? now : null,
    };

    if (assignedTo !== undefined) {
      updatedIssue.assigned_to = assignedTo;
    }

    this.issues[issueIndex] = updatedIssue;

    // Append to audit logs
    const auditLog: IssueAuditLog = {
      id: crypto.randomUUID(),
      issue_id: issueId,
      changed_by: userId,
      previous_status: previousStatus,
      new_status: newStatus,
      comment: comment || `Status updated from ${previousStatus} to ${newStatus}`,
      created_at: now,
      changer: this.profiles.find((p) => p.id === userId),
    };

    this.auditLogs.unshift(auditLog);

    // Try Supabase sync
    try {
      await supabaseAdmin
        .from('issues')
        .update({
          status: updatedIssue.status,
          assigned_to: updatedIssue.assigned_to,
          resolved_at: updatedIssue.resolved_at,
          updated_at: updatedIssue.updated_at,
        })
        .eq('id', issueId);

      await supabaseAdmin.from('issue_audit_logs').insert({
        id: auditLog.id,
        issue_id: auditLog.issue_id,
        changed_by: auditLog.changed_by,
        previous_status: auditLog.previous_status,
        new_status: auditLog.new_status,
        comment: auditLog.comment,
        created_at: auditLog.created_at,
      });
    } catch (err: any) {
      console.warn('[DB Repository] Supabase audit log note:', err?.message || err);
    }

    return this.enrichIssue(updatedIssue);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const totalInspections = this.inspections.length;
    const totalIssues = this.issues.length;

    const openIssues = this.issues.filter(
      (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
    );
    const openIssuesCount = openIssues.length;

    const criticalHazards = this.issues.filter(
      (i) => (i.severity === 'CRITICAL' || i.severity === 'HIGH') && i.status !== 'RESOLVED' && i.status !== 'CLOSED'
    );
    const criticalHazardsCount = criticalHazards.length;

    const resolvedCount = this.issues.filter(
      (i) => i.status === 'RESOLVED' || i.status === 'CLOSED'
    ).length;
    const resolvedIssuesPercentage =
      totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 100;

    const severityBreakdown = {
      LOW: this.issues.filter((i) => i.severity === 'LOW').length,
      MEDIUM: this.issues.filter((i) => i.severity === 'MEDIUM').length,
      HIGH: this.issues.filter((i) => i.severity === 'HIGH').length,
      CRITICAL: this.issues.filter((i) => i.severity === 'CRITICAL').length,
    };

    const categoryBreakdown = {
      SAFETY: this.issues.filter((i) => i.category === 'SAFETY').length,
      ACCESSIBILITY: this.issues.filter((i) => i.category === 'ACCESSIBILITY').length,
      INFRASTRUCTURE: this.issues.filter((i) => i.category === 'INFRASTRUCTURE').length,
      CROWD_OPERATIONAL: this.issues.filter((i) => i.category === 'CROWD_OPERATIONAL').length,
    };

    // Building breakdown across GMRIT buildings
    const buildingBreakdown = this.buildings.map((b) => {
      const bFloors = this.floors.filter((f) => f.building_id === b.id).map((f) => f.id);
      const bAreas = this.areas.filter((a) => bFloors.includes(a.floor_id)).map((a) => a.id);
      const bIssues = this.issues.filter((iss) => bAreas.includes(iss.area_id));

      return {
        buildingName: b.name,
        low: bIssues.filter((i) => i.severity === 'LOW').length,
        medium: bIssues.filter((i) => i.severity === 'MEDIUM').length,
        high: bIssues.filter((i) => i.severity === 'HIGH').length,
        critical: bIssues.filter((i) => i.severity === 'CRITICAL').length,
        total: bIssues.length,
      };
    });

    return {
      totalInspections,
      totalIssues,
      openIssuesCount,
      criticalHazardsCount,
      resolvedIssuesPercentage,
      avgRemediationDays: 1.4,
      severityBreakdown,
      categoryBreakdown,
      buildingBreakdown,
      recentInspections: this.inspections.slice(0, 5).map((ins) => this.enrichInspection(ins)),
      recentIssues: this.issues.slice(0, 6).map((iss) => this.enrichIssue(iss)),
    };
  }

  // Location management
  async createArea(floorId: string, name: string, roomNumber?: string): Promise<Area> {
    const newArea: Area = {
      id: crypto.randomUUID(),
      floor_id: floorId,
      name,
      room_number: roomNumber || null,
      created_at: new Date().toISOString(),
    };
    this.areas.push(newArea);

    const floor = this.floors.find((f) => f.id === floorId);
    if (floor) {
      if (!floor.areas) floor.areas = [];
      floor.areas.push(newArea);
    }
    return newArea;
  }

  async createFloor(buildingId: string, level: string): Promise<Floor> {
    const newFloor: Floor = {
      id: crypto.randomUUID(),
      building_id: buildingId,
      level,
      sequence_order: this.floors.length + 1,
      created_at: new Date().toISOString(),
      areas: [],
    };
    this.floors.push(newFloor);

    const b = this.buildings.find((building) => building.id === buildingId);
    if (b) {
      if (!b.floors) b.floors = [];
      b.floors.push(newFloor);
    }
    return newFloor;
  }

  async createBuilding(campusId: string, name: string, code: string, lat?: number, lng?: number): Promise<Building> {
    const newBuilding: Building = {
      id: crypto.randomUUID(),
      campus_id: campusId,
      name,
      code,
      latitude: lat || 18.4674,
      longitude: lng || 83.6603,
      created_at: new Date().toISOString(),
      floors: [],
    };
    this.buildings.push(newBuilding);

    const c = this.campuses.find((camp) => camp.id === campusId);
    if (c) {
      if (!c.buildings) c.buildings = [];
      c.buildings.push(newBuilding);
    }
    return newBuilding;
  }
}

export const dbRepository = new DatabaseRepository();
