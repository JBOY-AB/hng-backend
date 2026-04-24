/**
 * Builds a SQL query for filtering, sorting, and paginating profiles.
 * @param {Object} filters - Filter parameters from query string.
 * @returns {Object} Contains the SQL query string and values for parameterized query.
 */
export function buildQuery(filters) {
  let query = 'SELECT * FROM profiles';
  const conditions = [];
  const values = [];
  let valueIndex = 1;

  // Filter by gender
  if (filters.gender) {
    conditions.push(`gender = $${valueIndex++}`);
    values.push(filters.gender);
  }

  // Filter by age_group
  if (filters.age_group) {
    conditions.push(`age_group = $${valueIndex++}`);
    values.push(filters.age_group);
  }

  // Filter by country_id
  if (filters.country_id) {
    conditions.push(`country_id = $${valueIndex++}`);
    values.push(filters.country_id);
  }

  // Filter by min_age
  if (filters.min_age) {
    conditions.push(`age >= $${valueIndex++}`);
    values.push(filters.min_age);
  }

  // Filter by max_age
  if (filters.max_age) {
    conditions.push(`age <= $${valueIndex++}`);
    values.push(filters.max_age);
  }

  // Filter by min_gender_probability
  if (filters.min_gender_probability) {
    conditions.push(`gender_probability >= $${valueIndex++}`);
    values.push(filters.min_gender_probability);
  }

  // Filter by min_country_probability
  if (filters.min_country_probability) {
    conditions.push(`country_probability >= $${valueIndex++}`);
    values.push(filters.min_country_probability);
  }

  // Append WHERE conditions if any
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Sorting
  const sortBy = filters.sort_by || 'created_at';
  const order = filters.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  // Whitelist allowed sort columns to prevent SQL injection
  const allowedSortColumns = ['id', 'name', 'gender', 'age', 'age_group', 'country_id', 'country_name', 'created_at'];
  if (allowedSortColumns.includes(sortBy)) {
    query += ` ORDER BY ${sortBy} ${order}`;
  } else {
    // Default sort by created_at descending
    query += ' ORDER BY created_at DESC';
  }

  // Pagination
  const limit = parseInt(filters.limit) || 10;
  const page = parseInt(filters.page) || 1;
  const offset = (page - 1) * limit;
  query += ` LIMIT $${valueIndex++} OFFSET $${valueIndex++}`;
  values.push(limit, offset);

  return { query, values };
}