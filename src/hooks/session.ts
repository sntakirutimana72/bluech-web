import { useContext } from "react"
import { SessionContext } from "../providers"

const useSession = () => useContext(SessionContext)

export default useSession
