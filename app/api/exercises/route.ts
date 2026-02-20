import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type Exercise = { id: string; name: string; description: string; createdAt: Date };

const DEFAULT_EXERCISES: Omit<Exercise, "createdAt">[] = [
  { id: "squat", name: "Back Squat", description: "Compound lower-body strength movement" },
  { id: "deadlift", name: "Deadlift", description: "Full-body posterior chain strength" },
  { id: "bench", name: "Bench Press", description: "Upper-body pressing strength" },
  { id: "row", name: "Barbell Row", description: "Upper-back pulling movement" },
  { id: "press", name: "Overhead Press", description: "Shoulder pressing strength" },
  { id: "pullup", name: "Pull-up/Chin-up", description: "Upper body pulling and scapular strength" },
];

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `ex_${Date.now()}`;
}

function toClient(ex: any) {
  return {
    id: ex.id,
    name: ex.name,
    description: ex.description || "",
  };
}

export async function GET() {
  try {
    const db = await getDb();
    const exercises = db.collection<Exercise>("exercises");

    const count = await exercises.countDocuments();
    if (count === 0) {
      await exercises.insertMany(
        DEFAULT_EXERCISES.map((ex) => ({
          ...ex,
          createdAt: new Date(),
        }))
      );
    }

    const list = await exercises.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ ok: true, exercises: list.map(toClient) });
  } catch {
    return NextResponse.json({ error: "Failed to load exercises" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, id } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Missing exercise name" }, { status: 400 });
    }

    const db = await getDb();
    const exercises = db.collection<Exercise>("exercises");

    const exerciseId = typeof id === "string" && id.trim() ? slugify(id) : slugify(name);
    const existing = await exercises.findOne({ id: exerciseId });
    if (existing) {
      return NextResponse.json({ error: "Exercise already exists" }, { status: 409 });
    }

    const doc: Exercise = {
      id: exerciseId,
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      createdAt: new Date(),
    };

    await exercises.insertOne(doc);
    return NextResponse.json({ ok: true, exercise: toClient(doc) });
  } catch {
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, description } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing exercise id" }, { status: 400 });
    }

    const db = await getDb();
    const exercises = db.collection<Exercise>("exercises");

    const existing = await exercises.findOne({ id });
    if (!existing) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    const updateDoc: Partial<Exercise> = {};
    if (name && typeof name === "string") updateDoc.name = name.trim();
    if (description && typeof description === "string") updateDoc.description = description.trim();

    await exercises.updateOne({ id }, { $set: updateDoc });
    const updated = await exercises.findOne({ id });
    return NextResponse.json({ ok: true, exercise: toClient(updated) });
  } catch {
    return NextResponse.json({ error: "Failed to update exercise" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing exercise id" }, { status: 400 });
    }

    const db = await getDb();
    const exercises = db.collection<Exercise>("exercises");

    const res = await exercises.deleteOne({ id });
    if (res.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete exercise" }, { status: 500 });
  }
}

