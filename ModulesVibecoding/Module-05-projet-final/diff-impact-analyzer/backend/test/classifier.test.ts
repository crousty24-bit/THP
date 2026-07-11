import { describe, expect, it } from 'vitest'

import { getDomain, getFileType, getSensitiveCategories } from '../src/classifier.ts'

describe('file classification', () => {
  it('classifies root files and extensions', () => {
    expect(getDomain('README.md')).toBe('(root)')
    expect(getDomain('backend/src/app.ts')).toBe('backend')
    expect(getFileType('Dockerfile')).toBe('[no extension]')
    expect(getFileType('frontend/App.TSX')).toBe('.tsx')
  })

  it('detects documented sensitive categories', () => {
    expect(getSensitiveCategories('package-lock.json')).toEqual(['dependencies'])
    expect(getSensitiveCategories('.github/workflows/pages.yml')).toEqual(['infrastructure'])
    expect(getSensitiveCategories('backend/src/auth.service.ts')).toEqual(['security'])
    expect(getSensitiveCategories('db/migrate/20260710_create_users.rb')).toEqual(['database'])
    expect(getSensitiveCategories('infra/main.tf')).toEqual(['infrastructure'])
    expect(getSensitiveCategories('prisma/schema.prisma')).toEqual(['database'])
    expect(getSensitiveCategories('frontend\\auth\\permission-policy.ts')).toEqual(['security'])
  })

  it('does not match an undelimited security fragment', () => {
    expect(getSensitiveCategories('src/author.ts')).toEqual([])
  })
})
