import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type ProgramExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  notes?: string;
};

type Program = {
  id: string;
  clientEmail: string;
  title?: string;
  notes?: string;
  exercises: ProgramExercise[];
  schedule?: { day: string; exercises: ProgramExercise[] }[];
  createdAt: Date;
  updatedAt?: Date;
};

function toClient(program: any) {
  return {
    id: program.id,
    clientEmail: program.clientEmail,
    title: program.title || "",
    notes: program.notes || "",
    exercises: program.exercises || [],
    schedule: program.schedule || null,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt || program.createdAt,
  };
}

async function saveVersion(db: any, program: Program, action: "update" | "delete") {
  const versions = db.collection("program_versions");
  await versions.insertOne({
    programId: program.id,
    action,
    snapshot: program,
    versionAt: new Date(),
  });
}

export async function GET(_: Request, context: any) {
  try {
    const { id } = await context.params;
    const db = await getDb();
    const programs = db.collection<Program>("programs");
    const program = await programs.findOne({ id });
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, program: toClient(program) });
  } catch {
    return NextResponse.json({ error: "Failed to load program" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const { clientEmail, exercises, title, notes, schedule } = await req.json();

    if (clientEmail !== undefined && typeof clientEmail !== "string") {
      return NextResponse.json({ error: "Invalid client email" }, { status: 400 });
    }
    if (exercises !== undefined && (!Array.isArray(exercises) || exercises.length === 0) && schedule === undefined) {
      return NextResponse.json({ error: "Exercises required" }, { status: 400 });
    }

    const db = await getDb();
    const programs = db.collection<Program>("programs");
    const current = await programs.findOne({ id });
    if (!current) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    await saveVersion(db, current, "update");

    const updates: Partial<Program> = {
      updatedAt: new Date(),
    };
    if (typeof clientEmail === "string") updates.clientEmail = clientEmail.trim();
    if (typeof title === "string") updates.title = title.trim();
    if (typeof notes === "string") updates.notes = notes.trim();
    if (Array.isArray(exercises)) updates.exercises = exercises;
    if (Array.isArray(schedule)) updates.schedule = schedule;

    await programs.updateOne({ id }, { $set: updates });
    const updated = await programs.findOne({ id });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, program: toClient(updated) });
  } catch {
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: any) {
  try {
    const { id } = await context.params;
    const db = await getDb();
    const programs = db.collection<Program>("programs");
    const current = await programs.findOne({ id });
    if (!current) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    await saveVersion(db, current, "delete");
    await programs.deleteOne({ id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
