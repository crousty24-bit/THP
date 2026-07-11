import { describe, expect, it } from 'vitest'

import { parseNameStatus, parseNumstat } from '../src/git.ts'

describe('Git output parsers', () => {
  it('parses statuses including a rename and spaces', () => {
    const output = 'M\0src/file with spaces.ts\0R100\0src/old.ts\0src/new.ts\0'

    expect(parseNameStatus(output)).toEqual([
      { status: 'modified', path: 'src/file with spaces.ts', previousPath: null },
      { status: 'renamed', path: 'src/new.ts', previousPath: 'src/old.ts' },
    ])
  })

  it('parses text, binary and renamed numstat records', () => {
    const output = '12\t3\tsrc/app.ts\0-\t-\timage.png\0'
      + '5\t1\t\0src/old.ts\0src/new.ts\0'

    expect(parseNumstat(output)).toEqual([
      {
        path: 'src/app.ts',
        previousPath: null,
        additions: 12,
        deletions: 3,
        binary: false,
      },
      {
        path: 'image.png',
        previousPath: null,
        additions: null,
        deletions: null,
        binary: true,
      },
      {
        path: 'src/new.ts',
        previousPath: 'src/old.ts',
        additions: 5,
        deletions: 1,
        binary: false,
      },
    ])
  })
})
