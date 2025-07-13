import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Resend } from "resend";

const resend = new Resend('re_HG8r8oRB_KwbwfBD4z7dWwgRrfJZSnpeK');
const SUBMISSIONS_PATH = path.resolve(process.cwd(), "submissions.json");

function answersToHtml(data: Record<string, string>) {
  return `
    <h2>New Syntex Job Application</h2>
    <ul style="font-size:16px;line-height:1.7;">
      ${Object.entries(data)
        .map(
          ([key, value]) =>
            `<li><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</strong> ${value || '<i>No answer</i>'}</li>`
        )
        .join("")}
    </ul>
  `;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  let submissions = [];
  try {
    const file = await fs.readFile(SUBMISSIONS_PATH, "utf-8");
    submissions = JSON.parse(file);
    if (!Array.isArray(submissions)) submissions = [];
  } catch {
    submissions = [];
  }
  const submission = { ...data, submittedAt: new Date().toISOString() };
  submissions.push(submission);
  await fs.writeFile(SUBMISSIONS_PATH, JSON.stringify(submissions, null, 2), "utf-8");

  // Send email with Resend using the user's configuration
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'aerthea.branch@gmail.com',
      subject: 'New Syntex Job Application',
      html: answersToHtml(submission),
    });
  } catch (error) {
    console.error('Resend email error:', error);
  }

  return NextResponse.json({ success: true });
} 