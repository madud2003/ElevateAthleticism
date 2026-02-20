import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientEmail = searchParams.get("clientEmail");

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (user.publicMetadata as { role?: string } | undefined)?.role;
    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";

    if (!clientEmail && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (clientEmail && role !== "admin" && clientEmail !== email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const programs = db.collection<Program>("programs");

    const filter: Partial<Program> = {};
    if (clientEmail) filter.clientEmail = clientEmail;

    const list = await programs.find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ ok: true, programs: list.map(toClient) });
  } catch (e) {
    console.error("GET /api/programs error:", e);
    const msg = process.env.NODE_ENV === "production" ? "Failed to load programs" : (e as any)?.message || "Failed to load programs";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (user.publicMetadata as { role?: string } | undefined)?.role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { clientEmail, exercises, title, notes, schedule } = await req.json();
    if (!clientEmail || typeof clientEmail !== "string") {
      return NextResponse.json({ error: "Missing client email" }, { status: 400 });
    }
    if ((!Array.isArray(exercises) || exercises.length === 0) && !Array.isArray(schedule)) {
      return NextResponse.json({ error: "Missing exercises or schedule" }, { status: 400 });
    }

    const db = await getDb();
    const programs = db.collection<Program>("programs");

    const doc: Program = {
      id: `prog_${Date.now()}`,
      clientEmail: clientEmail.trim(),
      title: typeof title === "string" ? title.trim() : "",
      notes: typeof notes === "string" ? notes.trim() : "",
      exercises: Array.isArray(exercises) ? exercises : [],
      schedule: Array.isArray(schedule) ? schedule : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await programs.insertOne(doc);
    return NextResponse.json({ ok: true, program: toClient(doc) });
  } catch (e) {
    console.error("POST /api/programs error:", e);
    const msg = process.env.NODE_ENV === "production" ? "Failed to create program" : (e as any)?.message || "Failed to create program";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
