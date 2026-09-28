/**
 * App-wide display settings. Change these to rebrand the app for a client.
 * The user is a placeholder until authentication is added.
 */
export const APP_CONFIG = {
  appName: "Kira_AI",
  appDescription: "Kira_AI AI Assistant",
  user: {
    name: "Muneeb",
    subtitle: "Workspace",
  },
} as const;

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] ?? name;
