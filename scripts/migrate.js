import sql from '../lib/db.js';

async function migrate() {
  try {
    // Create profiles table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gender VARCHAR(50),
        gender_probability DECIMAL(3,2),
        age INTEGER,
        age_group VARCHAR(50),
        country_id VARCHAR(10),
        country_name VARCHAR(100),
        country_probability DECIMAL(3,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes for query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_profiles_age_group ON profiles(age_group);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_profiles_country_id ON profiles(country_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
    `;

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();