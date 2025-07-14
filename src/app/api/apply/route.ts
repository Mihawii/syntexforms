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
  try {
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
    try {
      await fs.writeFile(SUBMISSIONS_PATH, JSON.stringify(submissions.concat(submission), null, 2), "utf-8");
    } catch (fileError) {
      console.error('File write error:', fileError);
      // On Vercel, file writing will fail, but we continue to send email
    }
    try {
      await resend.emails.send({
        from: process.env.SUBMISSION_EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.SUBMISSION_EMAIL_TO || 'aerthea.branch@gmail.com',
        subject: 'New Syntex Job Application',
        html: answersToHtml(submission),
      });
    } catch (emailError) {
      console.error('Resend email error:', emailError);
      // Don't throw, just log
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    let message = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    } else if (typeof error === 'string') {
      message = error;
    }
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 