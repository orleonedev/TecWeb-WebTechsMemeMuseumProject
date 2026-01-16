export const parseTags = (tags: unknown): string[] => {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.map(String);
  }

  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    } catch {
      return tags.split(',').map(t => t.trim()).filter(t => t !== '');
    }
  }

  return [];
};
