import { memo } from 'react'
import { mapUIDToList } from '@/helpers/utils'
import { List } from '@/components/elements/Lists'
import type { PreviewListItemProps } from './PreviewElement'
import PreviewElement from './PreviewElement'

type Props = { previews: InboxPreview[] }

const PreviewList = ({ previews }: Props) => (
  <List<PreviewListItemProps>
    className="inbox-previews"
    ListItem={PreviewElement}
    list={mapUIDToList<InboxPreview, PreviewListItemProps>('prev-', previews)}
  />
)

export default memo(PreviewList)
