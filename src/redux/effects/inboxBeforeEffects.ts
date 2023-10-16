import { Draft } from '@reduxjs/toolkit'
import { getTime } from '@/helpers/utils'

interface ShadowState {
  previews: any[]
}

export const findPreview = <S extends ShadowState>(uid: AlphaNumeric, { previews }: Draft<S>) => (
  previews.find(({ id }) => id.toString() === uid.toString())
)

export const sortPreviews = <S extends ShadowState>({ previews }: Draft<S>) => {
  previews.sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt))
}
