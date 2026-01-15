import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { safeQuery } from "@/lib/db";

/* ============================================================
   1. STREAM ROAD SEGMENTS (CURSOR-BASED – SAFE FOR 1M+ ROWS)
============================================================ */
type RoadSegmentRow = {
  id: number;
  road_name: string;
  iri: number | null;
  speed: number | null;
  latitude: number | null;
  longitude: number | null;
  road_condition: boolean | null;
};

export const getRoadSegmentsTool = tool(
  async (input: { lastId?: number; limit?: number }) => {
    const limit =
      input.limit !== undefined && input.limit > 0
        ? Math.trunc(input.limit)
        : 100;

    const lastId = Math.max(0, Math.trunc(input.lastId ?? 0));

    const result = await safeQuery<RoadSegmentRow>(
      `
  SELECT
    id,
    road_name,
    iri,
    speed,
    latitude,
    longitude,
    road_condition
  FROM central_reg_data
  WHERE id > $1
  ORDER BY id
  LIMIT $2
`,
      [lastId, limit]
    );

    const rows = result.rows;

    return JSON.stringify({
      success: true,
      nextCursor: rows.length > 0 ? rows[rows.length - 1].id : null,
      data: rows,
    });
  },
  {
    name: "get_road_segments",
    description:
      "Streams road segments efficiently using cursor-based pagination. Safe for very large datasets.",
    schema: z.object({
      lastId: z.number().optional(),
      limit: z.number().optional(),
    }),
  }
);

/* ============================================================
   2. GLOBAL COUNTS
============================================================ */
export const countRoadSegmentsTool = tool(
  async () => {
    const result = await safeQuery(`
      SELECT COUNT(*)::bigint AS total
      FROM central_reg_data
    `);

    return JSON.stringify(result.rows[0]);
  },
  {
    name: "count_road_segments",
    description: "Returns total number of road segments",
    schema: z.object({}),
  }
);

/* ============================================================
   3. COUNT BY CONDITION
============================================================ */
export const countByConditionTool = tool(
  async () => {
    const result = await safeQuery(`
      SELECT
        road_condition,
        COUNT(*)::bigint AS count
      FROM central_reg_data
      GROUP BY road_condition
    `);

    return JSON.stringify({ data: result.rows });
  },
  {
    name: "count_by_road_condition",
    description: "Counts road segments grouped by condition",
    schema: z.object({}),
  }
);

/* ============================================================
   4. GLOBAL STATISTICS (AI SUMMARY TOOL)
============================================================ */
export const globalRoadStatsTool = tool(
  async () => {
    const result = await safeQuery(`
      SELECT
        COUNT(*)::bigint                                     AS total_segments,
        AVG(iri)                                             AS avg_iri,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY iri)     AS median_iri,
        MIN(iri)                                             AS min_iri,
        MAX(iri)                                             AS max_iri,
        AVG(speed)                                           AS avg_speed,
        MIN(speed)                                           AS min_speed,
        MAX(speed)                                           AS max_speed,
        COUNT(*) FILTER (WHERE road_condition = "very good") AS very_good_segments,
        COUNT(*) FILTER (WHERE road_condition = "good") AS good_segments,
        COUNT(*) FILTER (WHERE road_condition = "fair") AS fair_segments,
        COUNT(*) FILTER (WHERE road_condition = "poor") AS poor_segments,
        COUNT(*) FILTER (WHERE road_condition = "very poor") AS very_poor_segments
      FROM central_reg_data
    `);

    return JSON.stringify(result.rows[0]);
  },
  {
    name: "global_road_statistics",
    description: "Returns high-level statistics for the entire road network",
    schema: z.object({}),
  }
);

/* ============================================================
   5. IRI DISTRIBUTION (HISTOGRAM)
============================================================ */
export const iriDistributionTool = tool(
  async () => {
    const result = await safeQuery(`
      SELECT
        width_bucket(iri, 0, 20, 10) AS bucket,
        COUNT(*)::bigint             AS count
      FROM central_reg_data
      WHERE iri IS NOT NULL
      GROUP BY bucket
      ORDER BY bucket
    `);

    return JSON.stringify({ buckets: result.rows });
  },
  {
    name: "iri_distribution",
    description: "Returns histogram-style distribution of IRI values",
    schema: z.object({}),
  }
);

/* ============================================================
   6. ROAD NAME LOOKUP (TEXT SEARCH)
============================================================ */
export const lookupRoadByNameTool = tool(
  async (input: { query: string; limit?: number }) => {
    const limit = input.limit ?? 20;

    const result = await safeQuery(
      `
      SELECT DISTINCT road_name
      FROM central_reg_data
      WHERE road_name ILIKE $1
      LIMIT $2
    `,
      [`%${input.query}%`, limit]
    );

    return JSON.stringify({ matches: result.rows });
  },
  {
    name: "lookup_road_by_name",
    description: "Searches for road names using partial text matching",
    schema: z.object({
      query: z.string(),
      limit: z.number().optional(),
    }),
  }
);

/* ============================================================
   7. ROAD-LEVEL SUMMARY (PER ROAD)
============================================================ */
export const roadSummaryTool = tool(
  async (input: { roadName: string }) => {
    const result = await safeQuery(
      `
      SELECT
        road_name,
        COUNT(*)::bigint        AS segments,
        AVG(iri)                AS avg_iri,
        AVG(speed)              AS avg_speed,
        COUNT(*) FILTER (WHERE road_condition = false) AS bad_segments
      FROM central_reg_data
      WHERE road_name = $1
      GROUP BY road_name
    `,
      [input.roadName]
    );

    return JSON.stringify(result.rows[0] ?? null);
  },
  {
    name: "road_summary",
    description: "Returns aggregated statistics for a specific road",
    schema: z.object({
      roadName: z.string(),
    }),
  }
);

/* ============================================================
   8. SPATIAL BOUNDING BOX STATS
============================================================ */
export const bboxRoadStatsTool = tool(
  async (input: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => {
    const result = await safeQuery(
      `
      SELECT
        COUNT(*)::bigint AS count,
        AVG(iri)         AS avg_iri,
        AVG(speed)       AS avg_speed
      FROM central_reg_data
      WHERE latitude BETWEEN $1 AND $2
        AND longitude BETWEEN $3 AND $4
    `,
      [input.minLat, input.maxLat, input.minLng, input.maxLng]
    );

    return JSON.stringify(result.rows[0]);
  },
  {
    name: "bbox_road_statistics",
    description: "Returns statistics for road segments within a bounding box",
    schema: z.object({
      minLat: z.number(),
      maxLat: z.number(),
      minLng: z.number(),
      maxLng: z.number(),
    }),
  }
);

/* ============================================================
   9. DATA HEALTH CHECK
============================================================ */
export const dataHealthTool = tool(
  async () => {
    const result = await safeQuery(`
      SELECT
        COUNT(*) FILTER (WHERE iri IS NULL) AS iri_missing,
        COUNT(*) FILTER (WHERE speed IS NULL) AS speed_missing,
        COUNT(*) FILTER (
          WHERE latitude IS NULL OR longitude IS NULL
        ) AS location_missing
      FROM central_reg_data
    `);

    return JSON.stringify(result.rows[0]);
  },
  {
    name: "data_health_check",
    description: "Checks data completeness and missing values",
    schema: z.object({}),
  }
);

/* ============================================================
   10. GET ROAD SEGMENTS BY CONDITION
============================================================ */
export const getRoadSegmentsByConditionTool = tool(
  async (input: {
    condition: string;
    lastId?: number;
    limit?: number;
  }) => {
    const validConditions = [
      "very good",
      "good",
      "fair",
      "poor",
      "very poor",
    ];
    const condition = input.condition.toLowerCase();

    if (!validConditions.includes(condition)) {
      return JSON.stringify({
        success: false,
        error: `Invalid condition. Must be one of: ${validConditions.join(", ")}`,
      });
    }

    const limit =
      input.limit !== undefined && input.limit > 0
        ? Math.trunc(input.limit)
        : 100;

    const lastId = Math.max(0, Math.trunc(input.lastId ?? 0));

    const result = await safeQuery(
      `
      SELECT
        id,
        road_name,
        iri,
        speed,
        latitude,
        longitude,
        road_condition
      FROM central_reg_data
      WHERE road_condition = $1
        AND id > $2
      ORDER BY id
      LIMIT $3
    `,
      [condition, lastId, limit]
    );

    const rows = result.rows;

    return JSON.stringify({
      success: true,
      condition,
      count: rows.length,
      nextCursor: rows.length > 0 ? rows[rows.length - 1].id : null,
      data: rows,
    });
  },
  {
    name: "get_road_segments_by_condition",
    description:
      "Retrieves road segments filtered by condition (very good, good, fair, poor, very poor) using cursor-based pagination",
    schema: z.object({
      condition: z
        .string()
        .describe(
          "Road condition filter: very good, good, fair, poor, or very poor"
        ),
      lastId: z.number().optional().describe("Cursor for pagination"),
      limit: z
        .number()
        .optional()
        .describe("Number of segments per page (default: 100)"),
    }),
  }
);

/* ============================================================
   EXPORT ALL TOOLS
============================================================ */
export const allTools = [
  getRoadSegmentsTool,
  countRoadSegmentsTool,
  countByConditionTool,
  globalRoadStatsTool,
  iriDistributionTool,
  lookupRoadByNameTool,
  roadSummaryTool,
  bboxRoadStatsTool,
  dataHealthTool,
  getRoadSegmentsByConditionTool,
];
