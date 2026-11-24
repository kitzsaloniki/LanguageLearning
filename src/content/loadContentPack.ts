import { contentPackSchema, type ContentPack } from './schema'
import { validateContentPack, type ContentIssue } from './validateContent'

export class ContentValidationError extends Error {
  readonly issues: ContentIssue[]

  constructor(packId: string, issues: ContentIssue[]) {
    super(`Content pack "${packId}" is invalid:\n${formatIssues(issues)}`)
    this.name = 'ContentValidationError'
    this.issues = issues
  }
}

function formatIssues(issues: ContentIssue[]): string {
  return issues.map(({ path, message }) => `- ${path}: ${message}`).join('\n')
}

function toShapeIssues(error: import('zod').ZodError): ContentIssue[] {
  return error.issues.map((zodIssue) => ({
    path: zodIssue.path.join('.'),
    message: zodIssue.message,
  }))
}

/**
 * Parses raw data (JSON today, database rows later) into a content pack and
 * runs all integrity checks. Throws `ContentValidationError` on any issue.
 */
export function parseContentPack(raw: unknown, packId = 'unknown'): ContentPack {
  const result = contentPackSchema.safeParse(raw)
  if (!result.success) {
    throw new ContentValidationError(packId, toShapeIssues(result.error))
  }
  const issues = validateContentPack(result.data)
  if (issues.length > 0) {
    throw new ContentValidationError(result.data.id, issues)
  }
  return result.data
}
