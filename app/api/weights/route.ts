import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { programId, clientEmail, day, exerciseId, exerciseName, weight, reps, setNumber } = body;
    if (!programId || !clientEmail || !day || !exerciseId || weight == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // prevent duplicate logging for the same set within the current week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

    if (setNumber != null) {
      const dbCheck = await getDb();
      const exists = await dbCheck.collection('weights').findOne({
        programId,
        clientEmail,
        day,
        exerciseId,
        setNumber,
        createdAt: { $gte: startOfWeek }
      });
      if (exists) {
        return NextResponse.json({ error: 'Set already logged for this week' }, { status: 409 });
      }
    }
    // validate setNumber against program exercise definition when provided
    if (setNumber != null) {
      const num = Number(setNumber);
      if (!Number.isInteger(num) || num < 1) {
        return NextResponse.json({ error: "Invalid setNumber" }, { status: 400 });
      }
      const db = await getDb();
      const programs = db.collection("programs");
      const program = await programs.findOne({ id: programId });
      if (!program) {
        return NextResponse.json({ error: "Program not found" }, { status: 400 });
      }
      // find exercise either at program.exercises or inside any schedule day
      let exerciseDef: any = null;
      if (Array.isArray(program.exercises)) {
        exerciseDef = program.exercises.find((e: any) => e.id === exerciseId) || null;
      }
      if (!exerciseDef && Array.isArray(program.schedule)) {
        for (const day of program.schedule) {
          if (Array.isArray(day.exercises)) {
            const found = day.exercises.find((e: any) => e.id === exerciseId);
            if (found) {
              exerciseDef = found;
              break;
            }
          }
        }
      }
      if (!exerciseDef) {
        return NextResponse.json({ error: "Exercise not part of program or schedule" }, { status: 400 });
      }
      if (typeof exerciseDef.sets === 'number' && num > exerciseDef.sets) {
        return NextResponse.json({ error: "setNumber exceeds allowed sets for this exercise" }, { status: 400 });
      }
    }
    const db = await getDb();
    const entry = {
      programId,
      clientEmail,
      day,
      exerciseId,
      exerciseName: exerciseName || null,
      weight,
      reps: reps ?? null,
      setNumber: setNumber ?? null,
      createdAt: new Date(),
    };
    const res = await db.collection("weights").insertOne(entry);
    return NextResponse.json({ entry: { id: res.insertedId.toString(), ...entry } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const programId = url.searchParams.get("programId");
    const clientEmail = url.searchParams.get("clientEmail");
    const db = await getDb();
    const filter: any = {};
    if (programId) filter.programId = programId;
    if (clientEmail) filter.clientEmail = clientEmail;
    // Only return weights from the current week (starting Monday)
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const daysSinceMonday = (day + 6) % 7; // convert so Monday => 0
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
    filter.createdAt = { $gte: startOfWeek };
    const rows = await db.collection("weights").find(filter).sort({ createdAt: -1 }).limit(200).toArray();
    return NextResponse.json({ weights: rows.map(r => ({ id: r._id.toString(), ...r })) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { programId, clientEmail, day } = body || {};
    if (!programId || !clientEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

    const db = await getDb();
    const filter: any = { programId, clientEmail, createdAt: { $gte: startOfWeek } };
    if (day) filter.day = day;

    const res = await db.collection("weights").deleteMany(filter);
    return NextResponse.json({ deletedCount: res.deletedCount || 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, weight, reps, setNumber } = body || {};
    if (!id || weight == null) {
      return NextResponse.json({ error: "Missing id or weight" }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection("weights");
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const update: any = { weight, reps: reps ?? null, setNumber: setNumber ?? null, updatedAt: new Date() };
    await col.updateOne({ _id }, { $set: update });
    const updated = await col.findOne({ _id });
    if (!updated) return NextResponse.json({ error: "Update failed" }, { status: 500 });
    return NextResponse.json({ entry: { id: updated._id.toString(), ...updated } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
