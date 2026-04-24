import sql from '../lib/db.js';
import { uuidv7 } from 'uuidv7';
import fs from 'fs';
import path from 'path';

// Load sample profiles data
const profilesPath = path.resolve('./profiles.json');
let profiles = [];

try {
  const data = fs.readFileSync(profilesPath, 'utf8');
  profiles = JSON.parse(data);
} catch (error) {
  console.error('Error loading profiles.json:', error);
  // Provide some default sample data if file doesn't exist
  profiles = [
    {
      name: "John Doe",
      gender: "male",
      gender_probability: 0.95,
      age: 28,
      age_group: "young adult",
      country_id: "US",
      country_name: "United States",
      country_probability: 0.9
    },
    {
      name: "Jane Smith",
      gender: "female",
      gender_probability: 0.92,
      age: 34,
      age_group: "adult",
      country_id: "UK",
      country_name: "United Kingdom",
      country_probability: 0.85
    },
    {
      name: "Carlos Garcia",
      gender: "male",
      gender_probability: 0.88,
      age: 25,
      age_group: "young adult",
      country_id: "BR",
      country_name: "Brazil",
      country_probability: 0.92
    }
  ];
  console.log('Using default sample data');
}

async function seed() {
  try {
    console.log(`Seeding ${profiles.length} profiles...`);

    for (const profile of profiles) {
      // Generate UUID v7 for each profile
      const id = uuidv7();

      // Insert profile with ON CONFLICT DO NOTHING (assuming unique constraint on id)
      await sql`
        INSERT INTO profiles (
          id, name, gender, gender_probability, age, age_group,
          country_id, country_name, country_probability
        ) VALUES (
          ${id}, ${profile.name}, ${profile.gender}, ${profile.gender_probability},
          ${profile.age}, ${profile.age_group}, ${profile.country_id},
          ${profile.country_name}, ${profile.country_probability}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();