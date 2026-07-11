import { extname, posix } from 'node:path'

import type { SensitiveCategory } from '../../shared/contracts.ts'

const DEPENDENCY_FILES = new Set([
  'bun.lock',
  'bun.lockb',
  'gemfile',
  'gemfile.lock',
  'package-lock.json',
  'package.json',
  'pnpm-lock.yaml',
  'yarn.lock',
])

const INFRASTRUCTURE_FILES = new Set([
  '.gitlab-ci.yml',
  'compose.yaml',
  'compose.yml',
  'docker-compose.yaml',
  'docker-compose.yml',
  'dockerfile',
])

const DATABASE_FILES = new Set([
  'schema.rb',
  'schema.sql',
])

const SECURITY_TOKEN = /(^|[._-])(auth|authentication|authorization|security|permission|permissions|policy|policies)(?=$|[._-])/i

export function getDomain(filePath: string): string {
  const normalizedPath = filePath.replaceAll('\\', '/')
  return normalizedPath.includes('/') ? normalizedPath.split('/')[0] : '(root)'
}

export function getFileType(filePath: string): string {
  return extname(filePath).toLowerCase() || '[no extension]'
}

export function getSensitiveCategories(filePath: string): SensitiveCategory[] {
  const normalizedPath = filePath.replaceAll('\\', '/').toLowerCase()
  const segments = normalizedPath.split('/')
  const basename = posix.basename(normalizedPath)
  const categories = new Set<SensitiveCategory>()

  if (DEPENDENCY_FILES.has(basename)) {
    categories.add('dependencies')
  }

  const isGithubWorkflow = normalizedPath.startsWith('.github/workflows/')
    || normalizedPath.includes('/.github/workflows/')
  const isInfrastructureDirectory = segments.includes('infra') || segments.includes('terraform')
  if (
    isGithubWorkflow
    || isInfrastructureDirectory
    || INFRASTRUCTURE_FILES.has(basename)
    || normalizedPath.endsWith('.tf')
  ) {
    categories.add('infrastructure')
  }

  const isEnvironmentFile = basename === '.env' || basename.startsWith('.env.')
  if (isEnvironmentFile || segments.some((segment) => SECURITY_TOKEN.test(segment))) {
    categories.add('security')
  }

  const hasMigrationDirectory = segments.includes('migrations')
    || segments.some((segment, index) => segment === 'db' && segments[index + 1] === 'migrate')
  if (
    hasMigrationDirectory
    || DATABASE_FILES.has(basename)
    || normalizedPath.endsWith('prisma/schema.prisma')
  ) {
    categories.add('database')
  }

  return [...categories].sort()
}

