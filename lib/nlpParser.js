/**
 * Rule-based NLP parser for extracting filters from natural language queries.
 * No AI/LLMs used - purely pattern matching and keyword extraction.
 */
export class NLPParser {
  /**
   * Parses a natural language query and returns extracted filters.
   * @param {string} query - The search query string.
   * @returns {Object} Object containing extracted filters.
   */
  static parse(query) {
    if (!query || typeof query !== 'string') {
      return {};
    }

    const filters = {};
    const lowerQuery = query.toLowerCase().trim();

    // Extract gender
    if (lowerQuery.includes('male') || lowerQuery.includes('man') || lowerQuery.includes('boy')) {
      filters.gender = 'male';
    } else if (lowerQuery.includes('female') || lowerQuery.includes('woman') || lowerQuery.includes('girl')) {
      filters.gender = 'female';
    }

    // Extract age ranges and specific ages
    const ageRangeMatch = lowerQuery.match(/aged?\s+(\d+)[\-to](\d+)/) ||
                          lowerQuery.match(/age\s+(\d+)[\-to](\d+)/) ||
                          lowerQuery.match(/(\d+)[\-to](\d+)\s+years?/);

    if (ageRangeMatch) {
      filters.min_age = parseInt(ageRangeMatch[1]);
      filters.max_age = parseInt(ageRangeMatch[2]);
    } else {
      // Look for specific age mentions
      const ageMatch = lowerQuery.match(/aged?\s+(\d+)/) ||
                       lowerQuery.match(/age\s+(\d+)/) ||
                       lowerQuery.match(/(\d+)\s+years?/);
      if (ageMatch) {
        const age = parseInt(ageMatch[1]);
        filters.min_age = age;
        filters.max_age = age; // Exact age match
      }
    }

    // Extract age groups (if specified as groups like "young adult", "senior", etc.)
    const ageGroupMatch = lowerQuery.match(/\b(young|teenager|adult|middle.?aged|senior|elder)\b/);
    if (ageGroupMatch) {
      let group = ageGroupMatch[1];
      if (group === 'young') group = 'young adult';
      if (group === 'middle.?aged') group = 'middle aged';
      filters.age_group = group;
    }

    // Extract country information
    // Common country patterns
    const countryPatterns = [
      { pattern: /\b(usa|united states|america)\b/, country: 'United States', code: 'US' },
      { pattern: /\b(uk|united kingdom|britain|england)\b/, country: 'United Kingdom', code: 'UK' },
      { pattern: /\b(canada|canadian)\b/, country: 'Canada', code: 'CA' },
      { pattern: /\b(australia|aussie)\b/, country: 'Australia', code: 'AU' },
      { pattern: /\b(germany|deutschland|german)\b/, country: 'Germany', code: 'DE' },
      { pattern: /\b(france|french)\b/, country: 'France', code: 'FR' },
      { pattern: /\b(japan|japanese)\b/, country: 'Japan', code: 'JP' },
      { pattern: /\b(china|chinese)\b/, country: 'China', code: 'CN' },
      { pattern: /\b(india|indian)\b/, country: 'India', code: 'IN' },
      { pattern: /\b(brazil|brazilian)\b/, country: 'Brazil', code: 'BR' }
    ];

    for (const { pattern, country, code } of countryPatterns) {
      if (pattern.test(lowerQuery)) {
        filters.country_name = country;
        filters.country_id = code;
        break; // Use first match
      }
    }

    // Extract probability minimums (if mentioned with percentages or confidence)
    const genderProbMatch = lowerQuery.match(/gender\s+confidence\s+(\d+)%/) ||
                           lowerQuery.match(/(\d+)%.*gender/) ||
                           lowerQuery.match(/confident.*gender.*(\d+)%/);
    if (genderProbMatch) {
      filters.min_gender_probability = parseInt(genderProbMatch[1]) / 100;
    }

    const countryProbMatch = lowerQuery.match(/country\s+confidence\s+(\d+)%/) ||
                            lowerQuery.match(/(\d+)%.*country/) ||
                            lowerQuery.match(/confident.*country.*(\d+)%/);
    if (countryProbMatch) {
      filters.min_country_probability = parseInt(countryProbMatch[1]) / 100;
    }

    // Handle explicit "from" or "in" for countries
    const fromCountryMatch = lowerQuery.match(/(?:from|in)\s+(usa|united states|uk|united kingdom|canada|australia|germany|france|japan|china|india|brazil)/);
    if (fromCountryMatch) {
      // This would be handled by the countryPatterns above, but we can add specific logic here if needed
    }

    return filters;
  }
}