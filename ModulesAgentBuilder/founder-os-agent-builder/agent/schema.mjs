export const AGENT_ROLES = [
  "CODE_PRODUIT",
  "SEO_MARCHE",
  "PROSPECTION",
  "MAIL_SALES",
  "ADMIN_COMPTA",
  "COACH_APPRENTISSAGE",
];

export const qualificationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    besoinReformule: { type: "string", minLength: 1 },
    agentsAMobiliser: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: "string", enum: AGENT_ROLES },
          justification: { type: "string", minLength: 1 },
        },
        required: ["role", "justification"],
      },
    },
    risques: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          description: { type: "string", minLength: 1 },
          estPrincipal: { type: "boolean" },
        },
        required: ["description", "estPrincipal"],
      },
    },
    validationHumaine: {
      type: "object",
      additionalProperties: false,
      properties: {
        requise: { type: "boolean" },
        motif: { type: "string", minLength: 1 },
      },
      required: ["requise", "motif"],
    },
    prochaineAction: { type: "string", minLength: 1 },
    faits: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    hypotheses: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    inconnues: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
  required: [
    "besoinReformule",
    "agentsAMobiliser",
    "risques",
    "validationHumaine",
    "prochaineAction",
    "faits",
    "hypotheses",
    "inconnues",
  ],
};

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateQualification(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("La qualification doit être un objet JSON.");
  }

  const expectedKeys = qualificationSchema.required;
  const actualKeys = Object.keys(value);
  const missingKeys = expectedKeys.filter((key) => !actualKeys.includes(key));
  const extraKeys = actualKeys.filter((key) => !expectedKeys.includes(key));

  if (missingKeys.length || extraKeys.length) {
    throw new Error(
      `Contrat de sortie invalide (manquants: ${missingKeys.join(", ") || "aucun"}; ` +
        `inattendus: ${extraKeys.join(", ") || "aucun"}).`,
    );
  }

  if (!isNonEmptyString(value.besoinReformule)) {
    throw new Error("Le besoin reformulé est vide.");
  }

  if (!Array.isArray(value.agentsAMobiliser) || value.agentsAMobiliser.length === 0) {
    throw new Error("Au moins un agent doit être mobilisé.");
  }

  for (const agent of value.agentsAMobiliser) {
    if (
      !agent ||
      typeof agent !== "object" ||
      !AGENT_ROLES.includes(agent.role) ||
      !isNonEmptyString(agent.justification) ||
      Object.keys(agent).some((key) => !["role", "justification"].includes(key))
    ) {
      throw new Error("Un agent mobilisé ne respecte pas le contrat.");
    }
  }

  if (!Array.isArray(value.risques) || value.risques.length === 0) {
    throw new Error("Au moins un risque doit être signalé.");
  }

  for (const risk of value.risques) {
    if (
      !risk ||
      typeof risk !== "object" ||
      !isNonEmptyString(risk.description) ||
      typeof risk.estPrincipal !== "boolean" ||
      Object.keys(risk).some((key) => !["description", "estPrincipal"].includes(key))
    ) {
      throw new Error("Un risque ne respecte pas le contrat.");
    }
  }

  if (value.risques.filter((risk) => risk.estPrincipal).length !== 1) {
    throw new Error("La sortie doit identifier exactement un risque principal.");
  }

  if (
    !value.validationHumaine ||
    typeof value.validationHumaine !== "object" ||
    typeof value.validationHumaine.requise !== "boolean" ||
    !isNonEmptyString(value.validationHumaine.motif) ||
    Object.keys(value.validationHumaine).some((key) => !["requise", "motif"].includes(key))
  ) {
    throw new Error("La décision de validation humaine ne respecte pas le contrat.");
  }

  if (!isNonEmptyString(value.prochaineAction)) {
    throw new Error("La prochaine action est vide.");
  }

  for (const key of ["faits", "hypotheses", "inconnues"]) {
    if (!Array.isArray(value[key]) || value[key].some((item) => !isNonEmptyString(item))) {
      throw new Error(`Le champ ${key} doit être une liste de textes non vides.`);
    }
  }

  return value;
}
