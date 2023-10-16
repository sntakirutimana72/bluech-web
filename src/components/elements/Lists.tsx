import React, { HTMLAttributes, NamedExoticComponent } from 'react'

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  readonly uid: AlphaNumeric
  readonly value?: React.ReactNode
}

export interface ListProps<P> extends HTMLAttributes<HTMLUListElement> {
  list: P[]
  ListItem: NamedExoticComponent<P>
}

export const AnyListItem = ({ value, ...props }: ListItemProps) => <li {...props}>{value}</li>

export const List = <T extends ListItemProps>({ list, ListItem, ...props }: ListProps<T>) => (
  <ul {...props}>
    {
      list.map((item) => <ListItem key={item.uid} {...item} />)
    }
  </ul>
)
