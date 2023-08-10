/**
 * Returns FALSE if the given parameter is undefined, TRUE otherwise.
 * @param obj
 *
 */
export const isInit = (obj: any) => obj !== undefined

/**
 * Returns TRUE if the given parameter is null, FALSE otherwise
 * @param obj
 */
export const isNil = (obj: any) => obj === null

export const now = () => new Date()
