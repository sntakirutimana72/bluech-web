import React from "react"
import { Outlet } from "react-router-dom"
import type { SessionContextType } from "../providers"

type Props = Pick<SessionContextType, "authenticated"> & {
  children: React.ReactNode
}

const PrivateNode = ({ authenticated, children }: Props) => (
  authenticated ? (children || <Outlet />) : <></>
)

export default PrivateNode
