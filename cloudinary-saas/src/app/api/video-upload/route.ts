import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// This route ONLY saves metadata — the file was already uploaded directly to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { publicId, title, description, originalSize, compressedSize, duration, fileType } = body;

    if (!publicId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const video = await prisma.video.create({
      data: {
        userId,
        title,
        description: description || null,
        publicId,
        originalSize,
        compressedSize,
        duration: duration || 0,
        fileType: fileType || "video",
      },
    });

    return NextResponse.json(video);
  } catch (error: any) {
    console.error("Save media error:", error);
    return NextResponse.json(
      { error: "Failed to save media", details: error.message },
      { status: 500 }
    );
  }
}
