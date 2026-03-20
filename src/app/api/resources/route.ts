import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".html": "text/html",
  ".md": "text/markdown",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(request: NextRequest) {
  const filePath = request.nextUrl.searchParams.get("file");
  if (!filePath) {
    return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
  }

  // Only allow files from docs/ and source-data/ directories
  if (!filePath.startsWith("docs/") && !filePath.startsWith("source-data/")) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Prevent path traversal
  if (filePath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const projectRoot = /*turbopackIgnore: true*/ process.cwd();
  const fullPath = join(projectRoot, filePath);

  if (!existsSync(fullPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = await readFile(fullPath);
  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const fileName = filePath.split("/").pop() || "download";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentType === "application/pdf" || contentType === "text/html"
        ? `inline; filename="${fileName}"`
        : `attachment; filename="${fileName}"`,
    },
  });
}
