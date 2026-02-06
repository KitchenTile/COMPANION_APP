import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
// import { user } from "../store/store";

const supabaseUrl = "https://bgkwdvmsnidmyigsrtak.supabase.co";
const supabaseKey = "sb_publishable_7t3O9htcLRs0GTX6UutJvw_431NhOdT";

//supabase client anon key
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: Platform.OS === "web" ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
