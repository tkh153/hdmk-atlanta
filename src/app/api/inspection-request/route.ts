import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const LEAD_SOURCE = "hdmkatlanta.com";
const LEAD_TAGS = [
  "Website Lead",
  "Inspection Request",
  "HDMK Atlanta Landing Page",
];

type InspectionRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  preferredInspectionDate: string;
  leadType: string;
  message: string;
  pageUrl: string;
  tracking: Record<string, string>;
};

type GhlContactResponse = {
  id?: string;
  contactId?: string;
  contact?: {
    id?: string;
  };
};

type GhlPipeline = {
  id?: string;
  name?: string;
  stages?: Array<{
    id?: string;
    name?: string;
  }>;
};

function getEnv() {
  const token =
    process.env.GHL_PRIVATE_INTEGRATION_TOKEN ||
    process.env.GOHIGHLEVEL_PRIVATE_INTEGRATION_TOKEN ||
    process.env.HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN ||
    process.env.HIGHLEVEL_API_KEY ||
    process.env.GHL_API_KEY ||
    process.env.GOHIGHLEVEL_API_KEY ||
    process.env.PRIVATE_INTEGRATION_TOKEN ||
    process.env.API_KEY;

  const locationId =
    process.env.GHL_LOCATION_ID ||
    process.env.GOHIGHLEVEL_LOCATION_ID ||
    process.env.HIGHLEVEL_LOCATION_ID ||
    process.env.LOCATION_ID ||
    process.env.SUB_ACCOUNT_ID;

  return {
    token,
    locationId,
    version: process.env.GHL_API_VERSION || "2021-07-28",
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function readInspectionRequest(formData: FormData): InspectionRequest {
  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
  ];

  const tracking = trackingKeys.reduce<Record<string, string>>((result, key) => {
    const value = readFormValue(formData, key);

    if (value) {
      result[key] = value;
    }

    return result;
  }, {});

  return {
    firstName: readFormValue(formData, "firstName"),
    lastName: readFormValue(formData, "lastName"),
    phone: readFormValue(formData, "phone"),
    email: readFormValue(formData, "email"),
    propertyAddress: readFormValue(formData, "propertyAddress"),
    preferredInspectionDate: readFormValue(formData, "preferredInspectionDate"),
    leadType: readFormValue(formData, "leadType"),
    message: readFormValue(formData, "message"),
    pageUrl: readFormValue(formData, "pageUrl"),
    tracking,
  };
}

function validateLead(lead: InspectionRequest) {
  const requiredFields: Array<[keyof InspectionRequest, string]> = [
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["phone", "Phone"],
    ["email", "Email"],
    ["propertyAddress", "Property Address"],
  ];

  const missingField = requiredFields.find(([key]) => !lead[key]);

  if (missingField) {
    return `${missingField[1]} is required.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

function formatSubmittedAt() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date());
}

function buildLeadNote(lead: InspectionRequest) {
  const trackingText = Object.entries(lead.tracking)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return [
    "New inspection request from HDMK Atlanta landing page.",
    "",
    `Submitted At: ${formatSubmittedAt()} Eastern`,
    `Property Address: ${lead.propertyAddress}`,
    `Preferred Inspection Date: ${lead.preferredInspectionDate || "Not provided"}`,
    `Lead Type: ${lead.leadType || "Not provided"}`,
    `Lead Source: ${LEAD_SOURCE}`,
    lead.pageUrl ? `Page URL: ${lead.pageUrl}` : "",
    "",
    "Message:",
    lead.message || "Not provided",
    trackingText ? "" : "",
    trackingText ? "Tracking:" : "",
    trackingText,
  ]
    .filter(Boolean)
    .join("\n");
}

async function ghlFetch<T>(
  path: string,
  options: RequestInit,
  token: string,
  version: string,
) {
  const response = await fetch(`${GHL_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: version,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `GoHighLevel request failed with status ${response.status}.`,
    );
  }

  return data as T;
}

function getContactId(data: GhlContactResponse) {
  return data.contact?.id || data.id || data.contactId || "";
}

async function createOrUpdateContact(
  lead: InspectionRequest,
  token: string,
  locationId: string,
  version: string,
) {
  return ghlFetch<GhlContactResponse>(
    "/contacts/upsert",
    {
      method: "POST",
      body: JSON.stringify({
        locationId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        address1: lead.propertyAddress,
        source: LEAD_SOURCE,
        tags: LEAD_TAGS,
      }),
    },
    token,
    version,
  );
}

async function addContactTags(contactId: string, token: string, version: string) {
  if (!contactId) {
    return;
  }

  await ghlFetch(
    `/contacts/${contactId}/tags`,
    {
      method: "POST",
      body: JSON.stringify({ tags: LEAD_TAGS }),
    },
    token,
    version,
  );
}

async function addContactNote(
  contactId: string,
  note: string,
  token: string,
  version: string,
) {
  if (!contactId) {
    return;
  }

  await ghlFetch(
    `/contacts/${contactId}/notes`,
    {
      method: "POST",
      body: JSON.stringify({ body: note }),
    },
    token,
    version,
  );
}

async function findInspectionPipeline(token: string, locationId: string, version: string) {
  const configuredPipelineId = process.env.GHL_INSPECTION_PIPELINE_ID;
  const configuredStageId = process.env.GHL_NEW_LEAD_STAGE_ID;

  if (configuredPipelineId && configuredStageId) {
    return {
      pipelineId: configuredPipelineId,
      stageId: configuredStageId,
    };
  }

  try {
    const data = await ghlFetch<{ pipelines?: GhlPipeline[] }>(
      `/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`,
      { method: "GET" },
      token,
      version,
    );

    const pipeline = data.pipelines?.find(
      (item) => item.name?.toLowerCase() === "inspection leads",
    );

    const stage = pipeline?.stages?.find(
      (item) => item.name?.toLowerCase() === "new lead",
    );

    if (pipeline?.id && stage?.id) {
      return {
        pipelineId: pipeline.id,
        stageId: stage.id,
      };
    }
  } catch (error) {
    console.error("Unable to load GoHighLevel pipelines.", error);
  }

  // TODO: If the pipeline or stage cannot be discovered, add GHL_INSPECTION_PIPELINE_ID
  // and GHL_NEW_LEAD_STAGE_ID in Vercel. Contact creation still succeeds without them.
  return null;
}

async function createOpportunity(
  lead: InspectionRequest,
  contactId: string,
  token: string,
  locationId: string,
  version: string,
) {
  if (!contactId) {
    return;
  }

  const pipeline = await findInspectionPipeline(token, locationId, version);

  if (!pipeline) {
    return;
  }

  await ghlFetch(
    "/opportunities/",
    {
      method: "POST",
      body: JSON.stringify({
        locationId,
        contactId,
        pipelineId: pipeline.pipelineId,
        pipelineStageId: pipeline.stageId,
        name: `${lead.firstName} ${lead.lastName} - Inspection Request`,
        status: "open",
        source: LEAD_SOURCE,
      }),
    },
    token,
    version,
  );
}

export async function GET() {
  const { token, locationId } = getEnv();

  return NextResponse.json({
    ok: Boolean(token && locationId),
    hasPrivateIntegrationToken: Boolean(token),
    hasLocationId: Boolean(locationId),
  });
}

export async function POST(request: NextRequest) {
  const lead = readInspectionRequest(await request.formData());
  const validationError = validateLead(lead);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { token, locationId, version } = getEnv();

  if (!token || !locationId) {
    console.error(
      "Missing GoHighLevel environment variables. Set GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID.",
    );

    return NextResponse.json(
      {
        error:
          "We could not submit your request right now. Please try again in a few minutes.",
      },
      { status: 500 },
    );
  }

  try {
    const contact = await createOrUpdateContact(lead, token, locationId, version);
    const contactId = getContactId(contact);
    const note = buildLeadNote(lead);

    await addContactTags(contactId, token, version).catch((error) => {
      console.error("Unable to add GoHighLevel tags.", error);
    });

    await addContactNote(contactId, note, token, version).catch((error) => {
      console.error("Unable to add GoHighLevel note.", error);
    });

    await createOpportunity(lead, contactId, token, locationId, version).catch((error) => {
      console.error("Unable to create GoHighLevel opportunity.", error);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("GoHighLevel inspection request failed.", error);

    return NextResponse.json(
      {
        error:
          "We could not submit your request right now. Please check your information and try again.",
      },
      { status: 500 },
    );
  }
}
