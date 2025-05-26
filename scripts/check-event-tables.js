const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEventTables() {
  console.log("🔍 Checking event-related tables...\n");

  // Check if tables exist and get their structure
  const tables = ["blocos_parades", "events", "events_new"];

  for (const tableName of tables) {
    console.log(`📋 Checking table: ${tableName}`);

    try {
      // Try to get table info
      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact" })
        .limit(1);

      if (error) {
        console.log(
          `❌ Table ${tableName} does not exist or is not accessible`
        );
        console.log(`   Error: ${error.message}\n`);
      } else {
        console.log(`✅ Table ${tableName} exists with ${count} records`);
        if (data && data.length > 0) {
          console.log(`   Sample columns: ${Object.keys(data[0]).join(", ")}`);
        }
        console.log("");
      }
    } catch (err) {
      console.log(`❌ Error checking ${tableName}: ${err.message}\n`);
    }
  }

  // Check current events table structure
  console.log("📊 Getting detailed structure of existing tables...\n");

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(3);

      if (!error && data && data.length > 0) {
        console.log(`🔍 Sample data from ${tableName}:`);
        console.log(JSON.stringify(data[0], null, 2));
        console.log("");
      }
    } catch (err) {
      // Table doesn't exist, skip
    }
  }
}

checkEventTables().catch(console.error);
