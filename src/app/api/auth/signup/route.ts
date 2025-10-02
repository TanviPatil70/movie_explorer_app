import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Signup Body:", body);

    const { email, password, name } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("moviedb");

    const existingUser = await db.collection("users").findOne({ email });
    console.log("Existing User:", existingUser);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({ email, name, passwordHash, favorites: [] });
    console.log("Insert Result:", result);

    return NextResponse.json({ message: "User created", userId: result.insertedId });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
