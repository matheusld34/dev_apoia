export function createSlug(username: string): string {
    return username
        .normalize("NFD") // Normalize to decompose characters
        .replace(/[\u0300-\u036f]/g, "") // Remove di
        .replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .toLowerCase() // Convert to lowercase
        .trim();

}