const { z } = require('zod');

const sourceSchema = z.object({
  url: z.string().url(),
  title: z.string().nullable(),
  evidence: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low'])
});

const researchSchema = z.object({
  company: z.object({
    name: z.string().nullable(),
    description: z.string().nullable(),
    websiteType: z.string().nullable(),
    industry: z.string().nullable(),
    location: z.string().nullable()
  }),
  verifiedFacts: z.array(sourceSchema),
  productsAndServices: z.array(z.object({ name: z.string(), description: z.string(), sourceUrl: z.string().url(), confidence: z.enum(['high', 'medium', 'low']) })),
  targetAudience: z.array(z.object({ audience: z.string(), reasoning: z.string(), evidenceSourceUrls: z.array(z.string().url()), classification: z.enum(['stated', 'inferred']) })),
  businessModel: z.object({ model: z.string().nullable(), reasoning: z.string(), classification: z.enum(['stated', 'inferred', 'unknown']), sourceUrls: z.array(z.string().url()) }),
  aiAnalysis: z.object({ likelyBusinessPriorities: z.array(z.string()), possiblePainPoints: z.array(z.string()), relevantOpportunities: z.array(z.string()), qualificationReasoning: z.string(), recommendedNextAction: z.string() }),
  limitations: z.array(z.string())
});

function validateResearch(value) {
  return researchSchema.parse(value);
}

module.exports = { researchSchema, validateResearch };