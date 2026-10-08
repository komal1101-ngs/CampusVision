import { supabaseAdmin } from '../lib/supabaseAdmin';
import {
  SEED_PROFILES,
  SEED_CAMPUSES,
  SEED_BUILDINGS,
  SEED_FLOORS,
  SEED_AREAS,
} from '../services/dbService';

async function seedDatabase() {
  console.log('[Seed] Verifying Supabase connection and tables...');

  try {
    const { data: testCampuses, error: campErr } = await supabaseAdmin
      .from('campuses')
      .select('id')
      .limit(1);

    if (campErr) {
      console.log('[Seed] Supabase tables not yet created in PostgreSQL schema cache:', campErr.message);
      console.log('[Seed] Note: Please execute `supabase/migrations/20260101000000_initial_schema.sql` in your Supabase SQL editor.');
      console.log('[Seed] VisionCampus will run in autonomous hybrid mode with built-in seeded storage.');
      return;
    }

    console.log('[Seed] PostgreSQL tables verified! Seeding profiles and locations...');

    // Seed Profiles
    for (const p of SEED_PROFILES) {
      await supabaseAdmin.from('profiles').upsert({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        role: p.role,
        department: p.department,
      });
    }

    // Seed Campus
    for (const c of SEED_CAMPUSES) {
      await supabaseAdmin.from('campuses').upsert({
        id: c.id,
        name: c.name,
        code: c.code,
        latitude: c.latitude,
        longitude: c.longitude,
      });
    }

    // Seed Buildings
    for (const b of SEED_BUILDINGS) {
      await supabaseAdmin.from('buildings').upsert({
        id: b.id,
        campus_id: b.campus_id,
        name: b.name,
        code: b.code,
        latitude: b.latitude,
        longitude: b.longitude,
      });
    }

    // Seed Floors
    for (const f of SEED_FLOORS) {
      await supabaseAdmin.from('floors').upsert({
        id: f.id,
        building_id: f.building_id,
        level: f.level,
        sequence_order: f.sequence_order,
      });
    }

    // Seed Areas
    for (const a of SEED_AREAS) {
      await supabaseAdmin.from('areas').upsert({
        id: a.id,
        floor_id: a.floor_id,
        name: a.name,
        room_number: a.room_number,
      });
    }

    console.log('[Seed] Database successfully seeded with GMRIT Campus, 4 Buildings (MB, CMB, EEE, SAC), 7 Floors, 13 Areas, and 5 Roles.');
  } catch (err: any) {
    console.error('[Seed] Seeding exception:', err?.message || err);
  }
}

seedDatabase();
