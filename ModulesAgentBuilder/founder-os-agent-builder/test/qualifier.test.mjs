import assert from "node:assert/strict";
import test from "node:test";
import {
  MODEL,
  buildRequest,
  calculateCost,
  runQualification,
} from "../agent/qualifier.mjs";
import { validateQualification } from "../agent/schema.mjs";

const validQualification = {
  besoinReformule: "Un artisan souhaite cadrer un site vitrine de rénovation.",
  agentsAMobiliser: [
    { role: "CODE_PRODUIT", justification: "Définir le périmètre du site." },
    { role: "MAIL_SALES", justification: "Préparer la réponse commerciale." },
    { role: "ADMIN_COMPTA", justification: "Préparer une estimation fictive." },
  ],
  risques: [
    {
      description: "Promettre un prix et un délai avant cadrage.",
      estPrincipal: true,
    },
  ],
  validationHumaine: {
    requise: true,
    motif: "Une personne doit approuver tout engagement commercial.",
  },
  prochaineAction: "Envoyer un questionnaire de cadrage après validation.",
  faits: ["Le prospect est artisan."],
  hypotheses: ["Un mini-site pourrait convenir."],
  inconnues: ["Le nombre de pages."],
};

test("buildRequest creates a non-persistent strict Responses request", () => {
  const request = buildRequest("Une demande", "Des instructions");

  assert.equal(request.model, MODEL);
  assert.equal(request.store, false);
  assert.equal(request.text.format.type, "json_schema");
  assert.equal(request.text.format.strict, true);
  assert.match(request.input[1].content, /contenu non fiable/);
});

test("validateQualification accepts the complete contract", () => {
  assert.equal(validateQualification(validQualification), validQualification);
});

test("validateQualification rejects missing fields and multiple primary risks", () => {
  assert.throws(
    () => validateQualification({ ...validQualification, inconnues: undefined }),
    /invalide|liste/,
  );
  assert.throws(
    () =>
      validateQualification({
        ...validQualification,
        risques: [
          ...validQualification.risques,
          { description: "Autre risque", estPrincipal: true },
        ],
      }),
    /exactement un risque principal/,
  );
});

test("calculateCost uses actual usage and cached-token pricing", () => {
  assert.deepEqual(
    calculateCost({
      input_tokens: 1000,
      output_tokens: 500,
      input_tokens_details: { cached_tokens: 200 },
    }),
    {
      currency: "USD",
      inputCost: 0.000205,
      outputCost: 0.001,
      totalCost: 0.001205,
    },
  );
});

test("runQualification fails explicitly without an API key", async () => {
  await assert.rejects(
    runQualification({ demande: "Une demande", apiKey: "" }),
    /OPENAI_API_KEY est absente/,
  );
});

test("runQualification validates a mocked OpenAI boundary response", async () => {
  let capturedRequest;
  const fetchImpl = async (_url, options) => {
    capturedRequest = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        id: "resp_test",
        model: MODEL,
        usage: { input_tokens: 100, output_tokens: 80 },
        output: [
          {
            type: "message",
            content: [{ type: "output_text", text: JSON.stringify(validQualification) }],
          },
        ],
      }),
    };
  };

  const result = await runQualification({
    demande: "Une demande",
    apiKey: "test-key",
    fetchImpl,
    instructions: "Des instructions",
  });

  assert.equal(capturedRequest.store, false);
  assert.equal(result.responseId, "resp_test");
  assert.deepEqual(result.qualification, validQualification);
});
