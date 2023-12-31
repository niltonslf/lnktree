import routerMock from 'next-router-mock'

import {makeLink, makeUser, makeUserTheme, setup} from '@/__tests__/__helpers__'
import * as fetchUser from '@/api/usecases/user'
import UserPage from '@/app/[username]/page'
import {Link, User} from '@/models'
import {cleanup, screen, waitFor} from '@testing-library/react'

jest.mock('@/api/usecases/user')

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next-router-mock'),
  redirect: jest.fn(),
}))

const handleFetchLinks = (user?: User, links?: Link[]) => {
  const userMock = user ?? makeUser()
  const linksMock = links ?? [makeLink(), makeLink(), makeLink()]

  jest
    .spyOn(fetchUser, 'fetchUserProfile')
    .mockImplementation(() => Promise.resolve(userMock))
  jest
    .spyOn(fetchUser, 'fetchUserLinks')
    .mockImplementation(() => Promise.resolve(linksMock))
}

const makeSUT = async ({username = ''} = {}) => {
  return setup(await UserPage({params: {username}}))
}

describe('User page', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  it('should render page with links', async () => {
    const userMock = makeUser() as Required<User>
    Object.assign(userMock, {theme: makeUserTheme()})

    const linkMock = [makeLink(), makeLink(), makeLink()]

    routerMock.push(`/${userMock.username}`)
    handleFetchLinks(userMock, linkMock)

    await waitFor(() => makeSUT({username: userMock.username}))

    const name = screen.getByRole('heading', {level: 2})
    const linkList = await screen.queryByRole('list')
    const profilePicture = await screen.queryAllByRole('img')[0]

    expect(name.textContent).toBe(userMock.name)
    expect(linkList?.children).toHaveLength(3)
    expect(profilePicture?.getAttribute('src')).toContain(
      encodeURIComponent(userMock.pictureUrl),
    )
  })

  it('should load user custom theme', async () => {
    const userMock = makeUser(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      makeUserTheme(),
    ) as Required<User>

    const linkMock = makeLink()

    handleFetchLinks(userMock, [linkMock])

    await waitFor(() => makeSUT({username: userMock.username}))

    const container = screen.getByRole('main')
    const containerOverlay = container.querySelector('section')
    const buttons = container.querySelectorAll('li')
    const username = screen.getByText(userMock.name)

    if (!containerOverlay || !buttons) return fail()

    const {theme} = userMock

    expect(container.style.backgroundImage).toBe(
      `url(${theme?.backgroundImage})`,
    )
    expect(containerOverlay.style.backgroundColor).toBe(theme?.backgroundColor)
    expect(buttons[0].style.backgroundColor).toBe(theme?.buttonBackground)
    expect(buttons[0].style.color).toBe(theme?.buttonTextColor)
    expect(username.style.color).toBe(theme?.usernameColor)
  })
})
