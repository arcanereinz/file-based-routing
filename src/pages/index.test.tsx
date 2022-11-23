import '@testing-library/jest-dom'

import { jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Home from './index'

// const actual = jest.requireActual('@tanstack/react-location'), // use actual for all non-hook parts
// TeamPage.test.js
jest.mock('@tanstack/react-location', () => ({
  ...(jest.requireActual('@tanstack/react-location') as any),
  useMatch: () => ({
    data: {
      id: 1,
      name: 'test',
      html_url: 'https://example.com',
      description: 'sample',
    },
  }),
}))

test('loads and displays greeting', async () => {
  // ARRANGE
  const app = render(<Home />)

  await userEvent.click(screen.getByAltText('GitHub'))
  expect(app.container.querySelector('.mt-4')).toHaveTextContent('sample')

  // show content
  // app.debug()
})
