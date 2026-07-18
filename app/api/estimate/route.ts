import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { randomUUID } from "crypto";
import { entityLabels, getEntity } from "../../config/entities";

export const runtime = "nodejs";

const schema = z.object({
  entityId: z.enum(["chism-brothers", "chism-commercial"]).default("chism-brothers"),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  phone: z.string().trim().min(7),
  company: z.string().optional().default(""),
  preferredContact: z.string().optional().default(""),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  zip: z.string().trim().min(3),
  propertyType: z.string().trim().min(1),
  occupancy: z.string().optional().default(""),
  services: z.array(z.string()).min(1),
  description: z.string().trim().min(10),
  budget: z.string().optional().default(""),
  timeline: z.string().optional().default(""),
  decisionMaker: z.string().optional().default(""),
  consultationType: z.string().optional().default(""),
  preferredDate: z.string().optional().default(""),
  preferredTime: z.string().optional().default(""),
  leadSource: z.string().optional().default(""),
  referralName: z.string().optional().default(""),
  smsConsent: z.string().optional(),
  contactConsent: z.union([z.string(), z.literal(true)]),
  submittedFrom: z.string().optional(),
  referrer: z.string().nullable().optional()
});

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value: unknown): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8;font-weight:600;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e8e8e8">${escapeHtml(value)}</td>
  </tr>`;
}

type Lead = z.infer<typeof schema>;

async function sendCrmWebhook(payload: Lead, reference: string) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return { skipped: true };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": process.env.CRM_WEBHOOK_SECRET || ""
    },
    body: JSON.stringify({
      event: "estimate.created",
      reference,
      pipelineStage: "New Inquiry",
      entityId: payload.entityId,
      brandName: getEntity(payload.entityId).name,
      payload
    })
  });

  if (!response.ok) {
    throw new Error(`CRM webhook returned ${response.status}`);
  }

  return { skipped: false };
}

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please review the required fields and try again." },
        { status: 400 }
      );
    }

    const lead = parsed.data;
    const entity = getEntity(lead.entityId);
    const reference = `${entity.prefix}-${new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;

    const companyName = entity.name;
    const internalEmail =
      process.env.INTERNAL_NOTIFICATION_EMAIL || "bid@chismbrothers.com";
    const fromEmail =
      process.env.FROM_EMAIL || "Estimates <onboarding@resend.dev>";
    const replyTo = process.env.REPLY_TO_EMAIL || internalEmail;
    const resendKey = process.env.RESEND_API_KEY;

    const details = [
      row("Entity", entityLabels[lead.entityId]),
      row("Brand", companyName),
      row("Reference", reference),
      row("Name", `${lead.firstName} ${lead.lastName}`),
      row("Email", lead.email),
      row("Phone", lead.phone),
      row("Preferred contact", lead.preferredContact),
      row("Company", lead.company),
      row("Project address", `${lead.address}, ${lead.city} ${lead.zip}`),
      row("Property type", lead.propertyType),
      row("Occupancy", lead.occupancy),
      row("Services", lead.services.join(", ")),
      row("Description", lead.description),
      row("Budget", lead.budget),
      row("Timeline", lead.timeline),
      row("Role", lead.decisionMaker),
      row("Consultation", lead.consultationType),
      row(
        "Preferred appointment",
        [lead.preferredDate, lead.preferredTime].filter(Boolean).join(" — ")
      ),
      row("Lead source", lead.leadSource),
      row("Referral", lead.referralName),
      row("SMS consent", lead.smsConsent === "yes" ? "Yes" : "No"),
      row("Submitted from", lead.submittedFrom),
      row("Referrer", lead.referrer)
    ].join("");

    if (!resendKey) {
      return NextResponse.json(
        { error: "Email delivery is not configured yet." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);

    const crmResult = await Promise.allSettled([sendCrmWebhook(lead, reference)]);
    const crmFailed = crmResult.some((result) => result.status === "rejected");
    if (crmFailed) {
      console.error("CRM integration failed", crmResult);
    }

    const emailResults = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: internalEmail.split(",").map((email) => email.trim()),
        replyTo: lead.email,
        subject: `New lead: ${lead.firstName} ${lead.lastName} — ${reference}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#1f2924">
            <p style="margin:0 0 8px;color:#66736c;font-size:13px;text-transform:uppercase;letter-spacing:.08em">Lead ingest</p>
            <h1 style="font-size:24px;margin:0 0 18px">New estimate request</h1>
            <table style="border-collapse:collapse;width:100%">${details}</table>
          </div>
        `
      }),
      resend.emails.send({
        from: fromEmail,
        to: lead.email,
        replyTo,
        subject: `We received your estimate request — ${reference}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#1f2924;line-height:1.6">
            <h1 style="font-size:26px">Thank you, ${escapeHtml(lead.firstName)}.</h1>
            <p>We received your estimate request for <strong>${escapeHtml(
              lead.services.join(", ")
            )}</strong>.</p>
            <p>A member of the ${escapeHtml(
              companyName
            )} team will review the details and contact you about the next step.</p>
            <p>Your reference number is <strong>${reference}</strong>.</p>
          </div>
        `
      })
    ]);

    const failedEmail = emailResults.find((result) => result.error);
    if (failedEmail?.error) {
      console.error("Resend email failed", failedEmail.error);
      return NextResponse.json(
        { error: "We could not send your request. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, reference });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "We could not submit your request. Please try again." },
      { status: 500 }
    );
  }
}
