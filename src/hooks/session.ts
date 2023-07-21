import { useContext } from 'react'
import { sessionContext } from '../providers'

const useSession = () => useContext(sessionContext)

export default useSession
