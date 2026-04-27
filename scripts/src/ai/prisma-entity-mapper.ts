import { getAiPoliciesDir, getPrismaSchemaPath, getProjectRoot } from "./shared/paths.js";
import { readJsonFile, safeReadText, toProjectRelative } from "./shared/fs-utils.js";
import type { PrismaEntityMapReport, PrismaFieldMap, PrismaModelMap, SafetyCategory } from "./shared/types.js";

type EntityPolicyRecord = {
  name: string;
  field_groups?: {
    draft_safe?: string[];
    review_required?: string[];
  };
  high_risk?: boolean;
};

type EntityPolicyFile = {
  entities: EntityPolicyRecord[];
  high_risk_surfaces?: Array<{ name: string }>;
};

type ParsedField = {
  name: string;
  type: string;
  isList: boolean;
  isOptional: boolean;
  attributes: string[];
  relationTarget?: string;
};

function parseModels(schema: string): PrismaModelMap[] {
  const modelRegex = /^model\s+(\w+)\s+\{([\s\S]*?)^\}/gm;
  const parsedModels: Array<{ name: string; fields: ParsedField[] }> = [];

  let modelMatch: RegExpExecArray | null;
  while ((modelMatch = modelRegex.exec(schema)) !== null) {
    const modelName = modelMatch[1];
    const body = modelMatch[2];
    const lines = body
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//") && !line.startsWith("@@"));

    const fields = lines
      .map((line) => parseField(line))
      .filter((field): field is ParsedField => field !== null);

    parsedModels.push({ name: modelName, fields });
  }

  const modelNames = new Set(parsedModels.map((model) => model.name));

  return parsedModels.map((model) => ({
    name: model.name,
    fields: model.fields.map((field) => ({
      name: field.name,
      type: field.type,
      isList: field.isList,
      isOptional: field.isOptional,
      attributes: field.attributes,
      relation:
        field.relationTarget || modelNames.has(field.type)
          ? { kind: "relation", target: field.relationTarget ?? field.type }
          : { kind: "scalar" },
      safety: "safe_read",
    })),
  }));
}

function parseField(line: string): ParsedField | null {
  if (line.startsWith("@@")) {
    return null;
  }

  const parts = line.split(/\s+/);
  if (parts.length < 2) {
    return null;
  }

  const [name, rawType, ...rest] = parts;
  if (!name || !rawType || name.startsWith("//")) {
    return null;
  }

  const isList = rawType.endsWith("[]");
  const isOptional = rawType.endsWith("?");
  const type = rawType.replace(/\[\]|\?/g, "");
  const attributes = rest.filter((part) => part.startsWith("@"));
  const relationTarget =
    attributes.some((part) => part.startsWith("@relation")) && /^[A-Z]/.test(type) ? type : undefined;

  return {
    name,
    type,
    isList,
    isOptional,
    attributes,
    relationTarget,
  };
}

function applyPolicySafety(models: PrismaModelMap[], policy: EntityPolicyFile): PrismaModelMap[] {
  const byEntity = new Map(policy.entities.map((entity) => [entity.name, entity]));
  const forbiddenModels = new Set(
    policy.entities.filter((entity) => entity.high_risk === true).map((entity) => entity.name),
  );

  return models.map((model) => {
    const modelPolicy = byEntity.get(model.name);
    return {
      ...model,
      fields: model.fields.map((field) => ({
        ...field,
        safety: resolveFieldSafety(field.name, modelPolicy, forbiddenModels.has(model.name)),
      })),
    };
  });
}

function resolveFieldSafety(
  fieldName: string,
  modelPolicy: EntityPolicyRecord | undefined,
  forbidAll: boolean,
): SafetyCategory {
  if (forbidAll) {
    return "forbidden";
  }

  if (modelPolicy?.field_groups?.review_required?.includes("*")) {
    return "review_required";
  }

  if (modelPolicy?.field_groups?.draft_safe?.includes(fieldName)) {
    return "safe_draft_write";
  }

  if (modelPolicy?.field_groups?.review_required?.includes(fieldName)) {
    return "review_required";
  }

  return "safe_read";
}

export function mapPrismaEntities(): PrismaEntityMapReport {
  const projectRoot = getProjectRoot();
  const schemaPath = getPrismaSchemaPath();
  const policyPath = `${getAiPoliciesDir()}/entities.json`;
  const schema = safeReadText(schemaPath);
  const policy = readJsonFile<EntityPolicyFile>(policyPath);
  const parsedModels = parseModels(schema);
  const models = applyPolicySafety(parsedModels, policy);
  const focusedNames = new Set(["LocationPage", "Kitchen", "BlogPost", "PortfolioCase", "PriceRule"]);

  return {
    generatedAt: new Date().toISOString(),
    schemaPath: toProjectRelative(projectRoot, schemaPath),
    models,
    focusedEntities: models.filter((model) => focusedNames.has(model.name)),
  };
}
