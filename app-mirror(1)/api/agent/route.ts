// Agent API route - handles road inspection assistant queries
import { NextResponse } from "next/server";
import { processUserQuery } from "@/components/ai/lang-graph";

// Helper to extract quota info from Gemini error
function parseQuotaError(errorMessage: string) {
  const quotaMatch = errorMessage.match(/limit:\s*(\d+)/);
  const retryMatch = errorMessage.match(/Please retry in\s*([\d.]+)s/);
  const metricMatch = errorMessage.match(
    /quotaMetric['":\s]*([a-zA-Z0-9_/.]*generate[a-zA-Z0-9_/.]*)/i
  );

  return {
    isQuotaExceeded:
      errorMessage.includes("429") ||
      errorMessage.includes("quota exceeded") ||
      errorMessage.includes("Quota exceeded"),
    quotaLimit: quotaMatch ? parseInt(quotaMatch[1], 10) : null,
    retryAfterSeconds: retryMatch ? parseFloat(retryMatch[1]) : null,
    quotaMetric: metricMatch ? metricMatch[1] : "unknown",
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const message = body.message as string;

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' in request body" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Process the user query
    const response = await processUserQuery(message);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Agent API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    // Parse quota errors
    const quotaInfo = parseQuotaError(errorMessage);

    if (quotaInfo.isQuotaExceeded) {
      const retryTime = quotaInfo.retryAfterSeconds
        ? new Date(
            Date.now() + quotaInfo.retryAfterSeconds * 1000
          ).toLocaleTimeString()
        : "a few moments";

      return NextResponse.json(
        {
          error: "API Quota Exceeded",
          type: "quota_exceeded",
          message: `Daily API quota has been reached for the Gemini ${
            quotaInfo.quotaMetric || "API"
          }. Please try again after ${retryTime}.`,
          details: {
            quotaLimit: quotaInfo.quotaLimit,
            retryAfterSeconds: quotaInfo.retryAfterSeconds,
            retryTime,
            quotaMetric: quotaInfo.quotaMetric,
          },
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process request",
        type: "processing_error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Road Inspection AI Assistant API",
    endpoints: {
      POST: {
        path: "/api/agent",
        description: "Chat with the road inspection assistant",
        body: {
          message: "string - your question or request",
        },
      },
    },
  });
}
