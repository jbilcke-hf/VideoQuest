export function parseJsonList(content: string): string[] {
  // Extract JSON array from the content
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]");
  const jsonContent = content.slice(start, end + 1);

  // Parse as JSON into array of strings
  let objects: string[] = [];
  
  objects = JSON.parse(jsonContent);

  return objects;
}