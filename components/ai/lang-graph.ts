import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { allTools } from "./tools";
import { z, ZodObject, ZodString, ZodNumber, ZodBoolean } from "zod";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Build tool map ---
const toolMap: Record<string, (input: any) => Promise<string>> = {};
allTools.forEach((t) => {
  // Cast t as 'any' to bypass TypeScript union issue
  toolMap[t.name] = async (input: any) => {
    const result = await (t as any).invoke(input); // <-- cast here
    return typeof result === "string" ? result : JSON.stringify(result);
  };
});

// --- Convert Zod schema to Gemini SchemaType ---
function convertZodToGeminiSchema(zodSchema: any) {
  const schemaProps: Record<string, any> = {};

  if (zodSchema instanceof ZodObject) {
    const shape = zodSchema.shape;
    for (const key of Object.keys(shape) as Array<keyof typeof shape>) {
      const prop = shape[key];

      let type: SchemaType;
      if (prop instanceof ZodString) type = SchemaType.STRING;
      else if (prop instanceof ZodNumber) type = SchemaType.NUMBER;
      else if (prop instanceof ZodBoolean) type = SchemaType.BOOLEAN;
      else type = SchemaType.STRING;

      // Description is optional; fallback to empty string
      const description = (prop as any)?._def?.description ?? "";

      schemaProps[key] = { type, description };
    }
  }

  return {
    type: SchemaType.OBJECT,
    properties: schemaProps,
  };
}

// --- Build Gemini tool definitions ---
const toolDefinitions = allTools.map((t) => ({
  name: t.name,
  description: t.description,
  parameters: convertZodToGeminiSchema(t.schema),
}));

// --- Agent function ---
export async function processUserQuery(userMessage: string): Promise<string> {
  const systemPrompt = `You are a Road Data Analysis Assistant.
You have access to database tools to retrieve road segments, counts, statistics, distributions, road summaries, and health checks.
Always use the available tools when the user asks specific questions about road network data.`;

  const messages: any[] = [{ role: "user", parts: [{ text: userMessage }] }];

  try {
    let fullText = "";
    let iteration = 0;
    const maxIterations = 5;

    let response = await model.generateContent({
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: toolDefinitions as any }],
      contents: messages,
    } as any);

    while (iteration < maxIterations) {
      iteration++;
      const candidate = response.response.candidates?.[0];
      if (!candidate) break;

      const contentParts = candidate.content?.parts || [];
      for (const part of contentParts) {
        if ("text" in part && part.text) fullText += part.text;
      }

      // Check for function calls
      const functionCalls = contentParts
        .filter((p: any) => p.functionCall)
        .map((p: any) => p.functionCall);

      if (!functionCalls || functionCalls.length === 0) break;

      const toolResults: any[] = [];
      for (const call of functionCalls) {
        const toolName = call.name;
        const toolInput = call.args ?? {};

        try {
          const fn = toolMap[toolName];
          if (!fn) {
            toolResults.push({
              functionResponse: {
                name: toolName,
                response: { error: `Unknown tool: ${toolName}` },
              },
            });
            continue;
          }

          const result = await fn(toolInput);
          toolResults.push({
            functionResponse: { name: toolName, response: JSON.parse(result) },
          });
        } catch (error) {
          toolResults.push({
            functionResponse: {
              name: toolName,
              response: {
                error: error instanceof Error ? error.message : String(error),
              },
            },
          });
        }
      }

      // Push tool results and previous assistant content to messages
      messages.push({ role: "model", parts: contentParts });
      messages.push({ role: "user", parts: toolResults });

      // Get next response
      response = await model.generateContent({
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: toolDefinitions as any }],
        contents: messages,
      } as any);
    }

    return fullText || "Unable to generate response";
  } catch (error) {
    console.error("Agent processing error:", error);
    throw error;
  }
}
