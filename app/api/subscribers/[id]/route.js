import { NextResponse } from "next/server";
import { connectDB, hasMongoDBConfig } from "@/lib/db";
import Subscriber from "@/models/Subscriber";

// DELETE - Remove a subscriber
export async function DELETE(request, { params }) {
  if (!hasMongoDBConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const { id } = await params;
    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscriber removed successfully" });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}