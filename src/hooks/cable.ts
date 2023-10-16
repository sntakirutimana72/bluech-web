import { useContext } from 'react'
import { cableContext } from '@/providers'

const useCable = () => useContext(cableContext)

export default useCable
