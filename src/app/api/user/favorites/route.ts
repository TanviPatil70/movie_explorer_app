import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose"; // Import your mongoose connection helper

export async function GET(req: Request) {
  await dbConnect();  // Connect to MongoDB with Mongoose before queries

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  return new Response(JSON.stringify({ favorites: user?.favorites || [] }), { status: 200 });
}

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { movieId } = await req.json();
  if (!movieId) {
    return new Response(JSON.stringify({ error: "Missing movieId" }), { status: 400 });
  }

  const updateResult = await User.updateOne({ email: session.user.email }, { $addToSet: { favorites: movieId } });

  if (updateResult.modifiedCount === 0) {
    return new Response(JSON.stringify({ error: "No update performed" }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { movieId } = await req.json();
  if (!movieId) {
    return new Response(JSON.stringify({ error: "Missing movieId" }), { status: 400 });
  }

  const updateResult = await User.updateOne({ email: session.user.email }, { $pull: { favorites: movieId } });

  if (updateResult.modifiedCount === 0) {
    return new Response(JSON.stringify({ error: "No update performed" }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
