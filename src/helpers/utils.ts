import { uid } from 'uid'

export const isInit = (obj: any) => obj !== undefined

export const isNil = (obj: any) => obj === null

export const now = () => new Date()

export const nilFunc = () => {}

export const isEmpty = (arg: any[]) => arg.length === 0

export const getTime = (ISOTime: string) => new Date(ISOTime).getTime()

export const getActionableStatus = <T extends any[]>(status: ThunkStatus, dataList: T) => {
  const failure = status === 'failed' && isEmpty(dataList)
  const isPending = status === 'pending' && isEmpty(dataList)
  return [isPending, failure, !(failure || isPending)]
}

export const mapUIDToList = <P extends Dict, R>(prefix: string, data: P[]) => data.map((item) => {
  const key = item.id || uid()
  return {
    ...item,
    uid: `${prefix}${key}`,
  } as R
})
