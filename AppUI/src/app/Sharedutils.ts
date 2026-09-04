// utils.ts

export function getInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  return nameParts.map(part => part.charAt(0).toUpperCase()).join("");
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function convertToShortName(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length < 2) return "";

  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  return `${capitalize(firstName.slice(0, 2))}${capitalize(lastName.slice(0, 2))}`;
}