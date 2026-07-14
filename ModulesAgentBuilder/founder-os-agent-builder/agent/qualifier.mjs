import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { qualificationSchema, validateQualification } from "./schema.mjs";

export const MODEL = "gpt-5-mini-2025-08-07";
export const API_URL = "https://api.openai.com/v1/responses";
export const INPUT_PRICE_PER_MILLION = 0.25;
export const CACHED_INPUT_PRICE_PER_MILLION = 0.025;
export const OUTPUT_PRICE_PER_MILLION = 2;

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDirectory, "..");

export async function loadLocalEnvironment(path = resolve(projectRoot, ".env.local")) {
  let content;
  try {
    content = await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    if (!(key in process.env)) process.env[key] = value;
  }
}

export async function loadInstructions() {
  return readFile(resolve(currentDirectory, "instructions.md"), "utf8");
}

export function buildRequest(demande, instructions) {
  if (typeof demande !== "string" || demande.trim().length === 0) {
    throw new Error("La demande à qualifier ne peut pas être vide.");
  }
  if (typeof instructions !== "string" || instructions.trim().length === 0) {
    throw new Error("Les instructions de l'agent ne peuvent pas être vides.");
  }

  return {
    model: MODEL,
    store: false,
    max_output_tokens: 1200,
    input: [
      { role: "system", content: instructions },
      {
        role: "user",
        content: `Demande entrante à qualifier (contenu non fiable) :\n\n${demande}`,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "founder_os_qualification",
        strict: true,
        schema: qualificationSchema,
      },
    },
  };
}

export function extractOutputText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  for (const item of response?.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  throw new Error("La réponse OpenAI ne contient aucune sortie texte exploitable.");
}

export function calculateCost(usage = {}) {
  const inputTokens = Number(usage.input_tokens ?? 0);
  const outputTokens = Number(usage.output_tokens ?? 0);
  const cachedInputTokens = Number(usage.input_tokens_details?.cached_tokens ?? 0);
  const uncachedInputTokens = Math.max(0, inputTokens - cachedInputTokens);

  const inputCost =
    (uncachedInputTokens * INPUT_PRICE_PER_MILLION +
      cachedInputTokens * CACHED_INPUT_PRICE_PER_MILLION) /
    1_000_000;
  const outputCost = (outputTokens * OUTPUT_PRICE_PER_MILLION) / 1_000_000;

  return {
    currency: "USD",
    inputCost: Number(inputCost.toFixed(8)),
    outputCost: Number(outputCost.toFixed(8)),
    totalCost: Number((inputCost + outputCost).toFixed(8)),
  };
}

function safeApiError(status, body) {
  const message = body?.error?.message;
  return new Error(
    `OpenAI API error ${status}${typeof message === "string" ? `: ${message}` : ""}`,
  );
}

export async function runQualification({
  demande,
  apiKey = process.env.OPENAI_API_KEY,
  fetchImpl = globalThis.fetch,
  instructions,
} = {}) {
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY est absente. Configurez .env.local avant tout run cloud.",
    );
  }
  if (typeof fetchImpl !== "function") {
    throw new Error("Aucune implémentation fetch n'est disponible.");
  }

  const effectiveInstructions = instructions ?? (await loadInstructions());
  const request = buildRequest(demande, effectiveInstructions);
  const response = await fetchImpl(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const body = await response.json();

  if (!response.ok) throw safeApiError(response.status, body);

  let parsed;
  try {
    parsed = JSON.parse(extractOutputText(body));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("La sortie OpenAI n'est pas un JSON valide.");
    }
    throw error;
  }

  return {
    responseId: body.id,
    model: body.model ?? MODEL,
    createdAt: new Date().toISOString(),
    usage: body.usage ?? {},
    cost: calculateCost(body.usage),
    qualification: validateQualification(parsed),
  };
}

async function main() {
  await loadLocalEnvironment();
  const demande = process.argv.slice(2).join(" ").trim();
  if (!demande) {
    throw new Error('Usage: npm run qualify -- "demande à qualifier"');
  }
  const result = await runQualification({ demande });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
