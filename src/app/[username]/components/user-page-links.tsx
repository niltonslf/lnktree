import {LinkCard} from '@/app/components'
import {Link} from '@/models'

import {PageStylesObject} from '../utils'

type UserPageLinksProps = {
  links: Link[]
  pageStyles: PageStylesObject
}

export const UserPageLinks = ({links, pageStyles}: UserPageLinksProps) => {
  return (
    <LinkCard>
      {links.length > 0 &&
        links.map(link => {
          return (
            <LinkCard.Item
              key={link.url}
              path={link.url || '#'}
              bgColor={pageStyles?.buttonBackground?.value}
              textColor={pageStyles?.buttonTextColor?.value}>
              {link.label}
            </LinkCard.Item>
          )
        })}
    </LinkCard>
  )
}
