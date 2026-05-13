import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Parses a single line from an environment file.
 * Returns null for comments, empty lines, or invalid entries.
 */
const parseEnvLine = (line: string): { key: string; value: string } | null => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eqIndex = trimmed.indexOf('=');
  if (eqIndex <= 0) return null;

  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');

  if (!key) return null;
  return { key, value };
};

/**
 * Safely loads environment variables from .env.user file.
 * Only sets variables that aren't already defined.
 */
const loadUserEnv = (): void => {
  const envUserPath = join(process.cwd(), '.env.user');
  
  if (!existsSync(envUserPath)) return;

  try {
    const content = readFileSync(envUserPath, 'utf-8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      try {
        const parsed = parseEnvLine(line);
        if (!parsed) continue;
        
        // Only set if not already defined (respect existing env vars)
        if (!(parsed.key in process.env)) {
          process.env[parsed.key] = parsed.value;
        }
      } catch (parseError) {
        // Skip malformed lines silently (development convenience)
        continue;
      }
    }
  } catch (readError) {
    // Log but don't crash - env loading failures shouldn't prevent startup
    console.warn('Failed to load .env.user file:', readError instanceof Error ? readError.message : 'Unknown error');
  }
};

// Load user environment variables
loadUserEnv();

export {};