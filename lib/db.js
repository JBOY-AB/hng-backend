import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

// Create a Neon serverless driver
const sql = neon(DATABASE_URL);

export default sql;