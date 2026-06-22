import { createClient } from "@supabase/supabase-js";

const supabaseUrl="https://wctlpikrlcaknfwmufxv.supabase.co"
const supabaseKey="sb_publishable_Ot9shdp1t5vxK1EaXRSxvw_BLNo_ASi"
export const supabase=createClient(
    supabaseUrl,
    supabaseKey
)