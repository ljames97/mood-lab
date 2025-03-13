import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json(); // Receive the HTML content from frontend

    // Launch a headless browser
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set page content to the div HTML
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="moodboard.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
