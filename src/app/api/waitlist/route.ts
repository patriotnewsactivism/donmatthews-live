import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const dirPath = "/tmp";
    const filePath = path.join(dirPath, "waitlist.json");

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let list: Array<{ email: string; date: string }> = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        list = JSON.parse(fileContent);
      } catch (err) {
        list = [];
      }
    }

    if (!list.some(item => item.email.toLowerCase() === email.toLowerCase())) {
      list.push({ email, date: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, message: "Added to waitlist successfully!" });
  } catch (error) {
    console.error("Error in waitlist route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
