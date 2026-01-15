# AI Agent Setup Guide

Your Road Inspection AI Assistant is ready! Follow these steps to get it running.

## Prerequisites

1. **Google Gemini API Key**

   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **PostgreSQL Database**
   - Ensure your PostgreSQL database is running
   - Your `DATABASE_URL` environment variable is configured

## Setup Steps

### 1. Configure Environment Variables

Create or update your `.env.local` file with:

```bash
# Database (already configured)
DATABASE_URL=your_postgres_connection_string

# Google Gemini API
GOOGLE_API_KEY=your_google_api_key_here
```

### 2. Verify Dependencies

The required packages have been installed:

- `@google/generative-ai` - Gemini API client
- `@langchain/langgraph` - Agent framework (already installed)
- `@langchain/core` - LangChain core (already installed)

Run this to confirm:

```bash
pnpm list @google/generative-ai
```

### 3. Database Schema Requirements

The agent expects these tables in your PostgreSQL database:

**road_segments**

```sql
CREATE TABLE road_segments (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  location VARCHAR(255),
  length DECIMAL,
  width DECIMAL,
  surface_type VARCHAR(100),
  condition_rating INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**defects**

```sql
CREATE TABLE defects (
  id UUID PRIMARY KEY,
  road_segment_id UUID REFERENCES road_segments(id),
  defect_type VARCHAR(100),
  severity VARCHAR(50),
  location VARCHAR(255),
  description TEXT,
  reported_date TIMESTAMP,
  status VARCHAR(50),
  estimated_repair_cost DECIMAL
);
```

**inspections**

```sql
CREATE TABLE inspections (
  id UUID PRIMARY KEY,
  road_segment_id UUID REFERENCES road_segments(id),
  inspection_date TIMESTAMP,
  inspector_name VARCHAR(255),
  condition_rating INT,
  notes TEXT,
  photo_urls TEXT[],
  overall_assessment TEXT
);
```

**repair_recommendations**

```sql
CREATE TABLE repair_recommendations (
  id UUID PRIMARY KEY,
  road_segment_id UUID REFERENCES road_segments(id),
  defect_id UUID REFERENCES defects(id),
  recommended_action TEXT,
  priority_level INT,
  estimated_cost DECIMAL,
  urgency_status VARCHAR(50),
  created_at TIMESTAMP
);
```

**maintenance_records**

```sql
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY,
  road_segment_id UUID REFERENCES road_segments(id),
  maintenance_type VARCHAR(100),
  maintenance_date TIMESTAMP,
  cost DECIMAL
);
```

### 4. Run the Application

```bash
pnpm dev
```

The application will start at `http://localhost:3000`

## Using the AI Assistant

### Access Points

1. **Dashboard** (`/dashboard`)

   - Click the AI Assistant button (top-right)
   - Opens a chat panel on the right side

2. **Inspections** (`/inspections`)
   - AI Assistant is available via the button (top-right)
   - Can analyze inspection data for specific roads

### Example Queries

Ask the assistant:

- "What are the major defects in road segment {id}?"
- "What repairs are recommended for this road?"
- "Analyze the condition of road segment {id}"
- "Show me the inspection history for {id}"
- "Which roads need urgent repairs?"
- "What's the average repair cost for this road?"

## Architecture

### Components

1. **[components/ai/tools.ts](components/ai/tools.ts)**

   - Database query tools
   - Road segment analysis
   - Defect retrieval
   - Inspection history
   - Repair recommendations

2. **[components/ai/lang-graph.ts](components/ai/lang-graph.ts)**

   - Agent graph setup
   - Gemini integration
   - Tool execution pipeline
   - Message handling

3. **[components/ai/ai-assistant-sheet.tsx](components/ai/ai-assistant-sheet.tsx)**

   - React UI component
   - shadcn/ui sheet design
   - Chat interface
   - Message history

4. **[app/api/agent/route.ts](app/api/agent/route.ts)**
   - API endpoint for agent
   - Handles chat requests
   - Tool invocation gateway

### Data Flow

```
User Input (React Component)
    ↓
POST /api/agent
    ↓
Agent Graph (Gemini + LangChain)
    ↓
Tool Selection & Execution
    ↓
Database Queries (PostgreSQL)
    ↓
Gemini Response Generation
    ↓
Display in UI
```

## Features

✅ **Database Integration**

- Query road segments
- Fetch defect information
- Retrieve inspection records
- Get repair recommendations
- Analyze road conditions

✅ **Smart Tool Use**

- Automatic tool selection based on queries
- Parameter validation
- Error handling

✅ **User Interface**

- shadcn/ui sheet component
- Chat-based interaction
- Message timestamps
- Conversation history
- Loading indicators
- Error messages

✅ **LLM Integration**

- Google Gemini 2.0 Flash
- Free tier support
- Tool-use capabilities

## Troubleshooting

### "GOOGLE_API_KEY is not configured"

- Check `.env.local` has `GOOGLE_API_KEY` set
- Restart the dev server after adding the key

### "Failed to fetch..." errors

- Verify database connection string
- Check table names match your schema
- Ensure tables have required columns

### Agent not responding

- Check browser console for errors
- Verify API endpoint is accessible
- Check Gemini API quota (free tier limits)

## Next Steps

1. **Add more tools** - Extend `tools.ts` with additional queries
2. **Fine-tune prompts** - Customize the system prompt in `lang-graph.ts`
3. **Add authentication** - Secure the API endpoint
4. **Enhance UI** - Customize the chat component styling
5. **Add analytics** - Track agent usage and effectiveness

## Environment Checklist

- [ ] `GOOGLE_API_KEY` set in `.env.local`
- [ ] `DATABASE_URL` configured
- [ ] PostgreSQL running with required tables
- [ ] `pnpm install` completed
- [ ] No TypeScript errors (`pnpm run lint`)
- [ ] `pnpm dev` starts without errors

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Google Gemini API documentation
3. Check LangChain/LangGraph docs for agent customization
