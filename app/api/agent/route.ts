// Agent API route - handles road inspection assistant queries
import { NextResponse } from "next/server";
import { processUserQuery } from "@/components/ai/lang-graph";

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

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: errorMessage,
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
