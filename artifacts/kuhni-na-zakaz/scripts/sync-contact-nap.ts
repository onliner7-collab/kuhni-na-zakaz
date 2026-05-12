import { PrismaClient } from "@prisma/client";

import { CONTACT_DEFAULTS } from "../lib/contact-defaults";

const prisma = new PrismaClient();

const SITE_NAME = "КухниBY";
const LEGAL_ADDRESS = CONTACT_DEFAULTS.address;
const MAIN_PHONE = CONTACT_DEFAULTS.phone;
const MAIN_PHONE_DISPLAY = CONTACT_DEFAULTS.phoneDisplay;
const MAIN_EMAIL = CONTACT_DEFAULTS.email;

const replacements: Array<[RegExp, string]> = [
  [/\+375\s*\(?29\)?\s*626[-\s]?15[-\s]?47/g, MAIN_PHONE_DISPLAY],
  [/\+?375\s*29\s*626\s*15\s*47/g, MAIN_PHONE_DISPLAY],
  [/\+375\s*\(?29\)?\s*123[-\s]?45[-\s]?67/g, MAIN_PHONE_DISPLAY],
  [/\+?375\s*29\s*123\s*45\s*67/g, MAIN_PHONE_DISPLAY],
  [/info@kuhniminsk\.by/gi, MAIN_EMAIL],
  [/КухниMinsk/g, SITE_NAME],
  [/г\.\s*Минск,\s*ул\.\s*Притыцкого,\s*100/g, LEGAL_ADDRESS],
];

const textFieldsByModel = {
  kitchen: ["title", "description", "seoTitle", "seoDescription"],
  blogPost: ["title", "excerpt", "content", "seoTitle", "seoDescription"],
  staticPage: ["title", "content", "seoTitle", "seoDescription"],
  locationPage: [
    "title",
    "h1",
    "seoTitle",
    "seoDescription",
    "description",
    "intro",
    "localIntro",
    "timelineText",
    "visitDetails",
    "installDetails",
    "workZone",
    "deliveryCost",
    "measureCost",
    "ctaHeadline",
    "ctaSubtext",
    "phone",
    "address",
  ],
  portfolioCase: ["title", "shortTitle", "description", "task", "constraints", "solution", "result", "seoTitle", "seoDescription", "seoKeywords"],
  stylePage: ["title", "headline", "description", "intro", "content", "seoTitle", "seoDescription", "seoKeywords"],
  materialPage: ["title", "headline", "description", "intro", "content", "seoTitle", "seoDescription", "seoKeywords"],
  review: ["name", "city", "phone", "text", "region", "sourceUrl"],
} as const;

function normalizeText(value: string) {
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

async function normalizeModel(modelName: keyof typeof textFieldsByModel) {
  const model = prisma[modelName] as unknown as {
    findMany: (args: { select: Record<string, boolean> }) => Promise<Array<Record<string, unknown>>>;
    update: (args: { where: { id: number }; data: Record<string, string> }) => Promise<unknown>;
  };
  const fields = textFieldsByModel[modelName];
  const rows = await model.findMany({
    select: Object.fromEntries(["id", ...fields].map((field) => [field, true])),
  });

  let changed = 0;
  for (const row of rows) {
    const data: Record<string, string> = {};
    for (const field of fields) {
      const value = row[field];
      if (typeof value !== "string") continue;

      const nextValue = normalizeText(value);
      if (nextValue !== value) data[field] = nextValue;
    }

    if (Object.keys(data).length > 0 && typeof row.id === "number") {
      await model.update({ where: { id: row.id }, data });
      changed += 1;
    }
  }

  return changed;
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: SITE_NAME,
      phone: MAIN_PHONE,
      phoneDisplay: MAIN_PHONE_DISPLAY,
      phone2: "",
      phoneDisplay2: "",
      email: MAIN_EMAIL,
      address: LEGAL_ADDRESS,
      workingHours: CONTACT_DEFAULTS.workingHours,
      instagram: CONTACT_DEFAULTS.instagram,
    },
    update: {
      siteName: SITE_NAME,
      phone: MAIN_PHONE,
      phoneDisplay: MAIN_PHONE_DISPLAY,
      phone2: "",
      phoneDisplay2: "",
      email: MAIN_EMAIL,
      address: LEGAL_ADDRESS,
    },
  });

  const changedModels: Record<string, number> = {};
  for (const modelName of Object.keys(textFieldsByModel) as Array<keyof typeof textFieldsByModel>) {
    changedModels[modelName] = await normalizeModel(modelName);
  }

  console.log("NAP synchronized:", {
    phone: MAIN_PHONE_DISPLAY,
    email: MAIN_EMAIL,
    address: LEGAL_ADDRESS,
    changedModels,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
