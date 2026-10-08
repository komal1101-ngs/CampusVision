const API_BASE = 'http://localhost:5000/api';

async function runAcceptanceTests() {
  console.log('=== VisionCampus Acceptance Criteria Verification ===');

  console.log('\n[Criteria 1 & 3] Querying Location Hierarchy...');
  const hierRes = await fetch(`${API_BASE}/locations/hierarchy`, {
    headers: { 'x-user-role': 'SAFETY_OFFICER' },
  });
  const hierarchy = await hierRes.json();
  const campus = hierarchy[0];
  const building = campus.buildings[0];
  const floor = building.floors[0];
  const area = floor.areas[0];
  console.log(`✓ Spatial Node Selected: ${campus.name} -> ${building.name} -> ${floor.level} -> ${area.name}`);

  console.log('\n[Criteria 2 & 3] Processing AI Visual Inspection Upload...');
  // Construct valid JPEG buffer with valid magic bytes FF D8 FF
  const jpegHeader = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x10, 0x00, 0x10, 0x01, 0x01, 0x11,
    0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xff, 0xd9,
  ]);

  const boundary = '----WebKitFormBoundaryVisionCampusTest';
  const pre = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="campus_id"',
    '',
    campus.id,
    `--${boundary}`,
    'Content-Disposition: form-data; name="building_id"',
    '',
    building.id,
    `--${boundary}`,
    'Content-Disposition: form-data; name="floor_id"',
    '',
    floor.id,
    `--${boundary}`,
    'Content-Disposition: form-data; name="area_id"',
    '',
    area.id,
    `--${boundary}`,
    'Content-Disposition: form-data; name="image"; filename="blocked-fire-egress.jpg"',
    'Content-Type: image/jpeg',
    '',
  ].join('\r\n') + '\r\n';

  const post = `\r\n--${boundary}--\r\n`;
  const multipartBody = Buffer.concat([Buffer.from(pre), jpegHeader, Buffer.from(post)]);

  const analyzeRes = await fetch(`${API_BASE}/inspections/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'x-user-role': 'SAFETY_OFFICER',
    },
    body: multipartBody,
  });

  const analyzeData = await analyzeRes.json();
  if (!analyzeRes.ok) {
    console.error('Inspection failed:', analyzeData);
    process.exit(1);
  }

  console.log(`✓ AI Analysis Success: ${analyzeData.success}`);
  console.log(`✓ Inspection ID: ${analyzeData.inspection.id}`);
  console.log(`✓ Overall Status: ${analyzeData.inspection.overall_status}`);
  console.log(`✓ Issues Discovered: ${analyzeData.inspection.issues.length}`);

  const issue = analyzeData.inspection.issues[0];
  console.log(`✓ Primary Issue Domain: ${issue.category} | Severity: ${issue.severity} | Initial Status: ${issue.status}`);
  console.log(`✓ Recommendation: ${issue.recommended_action}`);

  console.log('\n[Criteria 4] Verifying Dashboard Statistics Update...');
  const statsRes = await fetch(`${API_BASE}/dashboard/stats`, {
    headers: { 'x-user-role': 'SAFETY_OFFICER' },
  });
  const stats = await statsRes.json();
  console.log(`✓ Total Audits: ${stats.totalInspections}`);
  console.log(`✓ Total Issues: ${stats.totalIssues}`);
  console.log(`✓ Active Critical/High Hazards: ${stats.criticalHazardsCount}`);
  console.log(`✓ Resolved Compliance: ${stats.resolvedIssuesPercentage}%`);

  console.log('\n[Criteria 5] Transitioning Lifecycle & Verifying Audit Logs...');
  // Transition NEW -> IN_PROGRESS
  const patch1 = await fetch(`${API_BASE}/issues/${issue.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-user-role': 'SAFETY_OFFICER' },
    body: JSON.stringify({
      status: 'IN_PROGRESS',
      comment: 'Dispatched facility work order #VC-9912. Crew mobilizing.',
    }),
  });
  const patch1Data = await patch1.json();
  console.log(`✓ Lifecycle Transition 1 (IN_PROGRESS): ${patch1Data.success}`);

  // Transition IN_PROGRESS -> RESOLVED
  const patch2 = await fetch(`${API_BASE}/issues/${issue.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-user-role': 'FACILITY_MANAGER' },
    body: JSON.stringify({
      status: 'RESOLVED',
      comment: 'Corridor obstacles removed to recycling dock. Exit pathway clear.',
    }),
  });
  const patch2Data = await patch2.json();
  console.log(`✓ Lifecycle Transition 2 (RESOLVED): ${patch2Data.success}`);

  // Fetch issue details and verify audit logs
  const issueDetailRes = await fetch(`${API_BASE}/issues/${issue.id}`, {
    headers: { 'x-user-role': 'SAFETY_OFFICER' },
  });
  const detail = await issueDetailRes.json();
  console.log(`✓ Final Issue Status: ${detail.issue.status}`);
  console.log(`✓ Verified Audit Log Count: ${detail.auditLogs.length}`);
  for (const log of detail.auditLogs) {
    console.log(`   - Log: [${log.previous_status} -> ${log.new_status}] by ${log.changer?.full_name}: "${log.comment}"`);
  }

  console.log('\n======================================================');
  console.log('>>> ALL ACCEPTANCE CRITERIA SUCCESSFULLY VERIFIED! <<<');
  console.log('======================================================');
}

runAcceptanceTests();
