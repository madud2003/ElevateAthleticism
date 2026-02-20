import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

function csvEscape(value: any) {
  if (value == null) return "";
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get('programId');
    const clientEmail = searchParams.get('clientEmail');

    if (!programId || !clientEmail) {
      return NextResponse.json({ error: 'programId and clientEmail required' }, { status: 400 });
    }

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const daysSinceMonday = (day + 6) % 7; // Monday => 0
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0,0,0,0);
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

    const db = await getDb();
    const rows = await db.collection('weights').find({
      programId,
      clientEmail,
      createdAt: { $gte: startOfWeek }
    }).sort({ createdAt: 1 }).toArray();

    const header = ['Date','Exercise ID','Exercise Name','Set Number','Weight','Reps','Recorded At'];
    const lines = [header.join(',')];

    for (const r of rows) {
      const date = r.day || '';
      const exerciseId = r.exerciseId || '';
      const exerciseName = r.exerciseName || '';
      const setNumber = r.setNumber != null ? String(r.setNumber) : '';
      const weight = r.weight != null ? String(r.weight) : '';
      const reps = r.reps != null ? String(r.reps) : '';
      const recordedAt = r.createdAt ? new Date(r.createdAt).toISOString() : '';
      lines.push([
        csvEscape(date),
        csvEscape(exerciseId),
        csvEscape(exerciseName),
        csvEscape(setNumber),
        csvEscape(weight),
        csvEscape(reps),
        csvEscape(recordedAt),
      ].join(','));
    }

    const body = lines.join('\n');
    const filename = `weights-${clientEmail.replace(/[^a-z0-9@.\-]/gi, '_')}-${startOfWeek.toISOString().slice(0,10)}.csv`;

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
