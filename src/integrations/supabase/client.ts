// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sgbscopplrpnekqetknq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnYnNjb3BwbHJwbmVrcWV0a25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTczNjIsImV4cCI6MjA2NTc3MzM2Mn0.Km-1shy4IbFBDUZHmJFZ-ACn_Gx5hHTsYqJsfVQu69I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);