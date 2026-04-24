# Backend Wizards Stage 2 (Intelligence Query Engine)

A Node.js/Express REST API for querying profiles with filtering, sorting, pagination, and rule-based natural language search.

## Features

- **RESTful Endpoints**:
  - `GET /api/profiles` - Filter, sort, and paginate profiles
  - `GET /api/profiles/search?q=` - Rule-based NLP search
- **Filtering Options**:
  - Gender, age group, country ID
  - Age ranges (min_age, max_age)
  - Probability thresholds (min_gender_probability, min_country_probability)
- **Sorting & Pagination**: Customizable sort fields and order with page/limit
- **Rule-Based NLP**: Extracts filters from natural language queries without AI/LLMs
- **Database**: Neon serverless PostgreSQL with UUID v7 primary keys
- **Error Handling**: Consistent `{ status, message }` error format
- **CORS**: Enabled for all origins (*)

## NLP Approach

The search endpoint uses rule-based natural language processing to extract filters from text queries. Currently supports:

### Supported Keywords & Patterns

- **Gender**: `male`, `female`, `man`, `woman`, `boy`, `girl`
- **Age**:
  - Specific age: `aged 25`, `age 30`, `25 years`
  - Age ranges: `aged 20-30`, `age 25 to 35`, `20-25 years`
  - Age groups: `young`, `teenager`, `adult`, `middle aged`, `senior`, `elder`
- **Countries**: 
  - USA/United States/America
  - UK/United Kingdom/Britain/England
  - Canada
  - Australia
  - Germany
  - France
  - Japan
  - China
  - India
  - Brazil
- **Probability Confidence**:
  - `gender confidence 80%`, `90% confident gender`
  - `country confidence 75%`, `80% sure country`

### Limitations

- Only exact keyword matching (no stemming or synonyms beyond listed)
- No contextual understanding (e.g., "not male" would still match male)
- Probability extraction requires percentage format with % symbol
- Country detection uses predefined list; no fuzzy matching
- Age group detection is basic; may miss colloquial terms
- Combines multiple criteria with AND logic only
- No handling of negations, comparisons, or complex linguistic structures

## Database Schema

```sql
profiles (
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
)
```

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file from `.env.example` and set your `DATABASE_URL`
4. Run database migrations: `npm run migrate`
5. Seed the database: `npm run seed`
6. Start the server: `npm start` or `npm run dev` for development

## API Endpoints

### GET /api/profiles

Returns filtered, sorted, and paginated profiles.

**Query Parameters**:
- `gender` (string): Filter by gender
- `age_group` (string): Filter by age group
- `country_id` (string): Filter by country ID
- `min_age` (integer): Minimum age
- `max_age` (integer): Maximum age
- `min_gender_probability` (decimal): Minimum gender probability (0-1)
- `min_country_probability` (decimal): Minimum country probability (0-1)
- `sort_by` (string): Field to sort by (default: `created_at`)
- `order` (string): Sort order (`asc` or `desc`, default: `desc`)
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 10)

**Example**:
```
/api/profiles?gender=female&min_age=25&max_age=35&sort_by=name&order=asc&page=1&limit=10
```

### GET /api/profiles/search

Returns profiles matching natural language query.

**Query Parameters**:
- `q` (string, required): Natural language search query

**Examples**:
```
/api/profiles/search?q=male aged 25-30 from USA
/api/profiles/search?q=female adult from UK with 90% country confidence
/api/profiles/search?q=young person from Brazil
```

## Project Structure

```
hng-backend/
├── api/
│   └── index.js          # Express app and routes
├── lib/
│   ├── db.js             # Neon database connection
│   ├── queryBuilder.js   # SQL query builder for filters/sort/pagination
│   └── nlpParser.js      # Rule-based NLP parser
├── scripts/
│   ├── migrate.js        # Database migration (table creation + indexes)
│   └── seed.js           # Seed data from profiles.json
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## Dependencies

- `express`: Web framework
- `cors`: CORS middleware
- `@neondatabase/serverless`: Neon serverless PostgreSQL driver
- `uuidv7`: UUID version 7 generation
- `nodemon`: Development dependency for auto-restart

## Environment Variables

- `DATABASE_URL`: Neon PostgreSQL connection string
- `PORT`: Server port (defaults to 3000)

## Deployment

Configured for Vercel deployment with `vercel.json`. The API endpoint will be available at `/api/*`.

## License

MIT