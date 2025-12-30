const SUPABASE_URL = "https://ynmecpnwuylphtoqeqko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubWVjcG53dXlscGh0b3FlcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MTE0OTQsImV4cCI6MjA4MjM4NzQ5NH0.GEQt2gJGi1o7Dr7Se8jKfPvBMjAkazJcgTum3ZLMQNU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Supabase connected");
