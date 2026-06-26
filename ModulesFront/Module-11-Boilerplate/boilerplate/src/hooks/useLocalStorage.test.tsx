import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  it('reads, writes and removes a stored value', () => {
    const { result } = renderHook(() => useLocalStorage('starter:test', 'initial'))

    expect(result.current[0]).toBe('initial')

    act(() => {
      result.current[1]('updated')
    })

    expect(window.localStorage.getItem('starter:test')).toBe('"updated"')

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe('initial')
    expect(window.localStorage.getItem('starter:test')).toBe('"initial"')
  })
})
