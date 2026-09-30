import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CaseConverter, { convertCases } from './index'

function values(input: string) {
  return Object.fromEntries(convertCases(input).map(({ label, value }) => [label, value]))
}

describe('CaseConverter', () => {
  it('converts hello world to all eight cases', () => {
    expect(values('hello world')).toEqual({
      camelCase: 'helloWorld',
      PascalCase: 'HelloWorld',
      snake_case: 'hello_world',
      CONSTANT_CASE: 'HELLO_WORLD',
      'kebab-case': 'hello-world',
      'Title Case': 'Hello World',
      'UPPER CASE': 'HELLO WORLD',
      'lower case': 'hello world',
    })
  })

  it('splits camelCase and acronym boundaries', () => {
    expect(values('myHTTPServer').snake_case).toBe('my_http_server')
  })

  it('handles empty and non-ASCII input', () => {
    expect(values('').camelCase).toBe('')
    expect(values('déjà ünicode').snake_case).toBe('déjà_ünicode')
  })

  it('fails gracefully when clipboard is unavailable', async () => {
    vi.stubGlobal('navigator', {})
    render(<CaseConverter />)
    fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'hello world' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Copy' })[0])
    expect(await screen.findByRole('status', { name: '' })).toHaveTextContent(/clipboard is unavailable/i)
    vi.unstubAllGlobals()
  })
})
