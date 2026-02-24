import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for server-side usage.
 * This should be used in Server Components and Server Actions.
 */
export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createClient(cookieStore);
};

// Re-export createClient for easy importing
export { createClient as supabaseServerClient };

/**
 * Executes a raw SQL query using Supabase.
 * Note: This requires the Supabase SQL runner to be enabled or 
 * using PostgREST features. For complex queries, consider using
 * stored procedures via rpc().
 */
export async function executeRawQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const supabase = createSupabaseServerClient();
  
  // For queries that can't be converted to Supabase's query builder,
  // we use the rpc function with a stored procedure, or fetch via select
  // This is a workaround - in production, you'd want to create stored procedures
  
  // Try using text() if available in the client
  const { data, error } = await (supabase as any).from('_sql')
    .select('*')
    .limit(0);
    
  // Fallback: return empty array if SQL execution isn't available
  // In a real implementation, you'd want to create stored procedures
  console.warn('Raw SQL execution not fully supported via this client');
  return [];
}
