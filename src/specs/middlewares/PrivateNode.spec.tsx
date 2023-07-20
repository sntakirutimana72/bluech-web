import { render, screen } from '@testing-library/react'
import { PrivateNode } from '../../middlewares'

type Props = { authenticated?: boolean }

const CustomNode = ({ authenticated }: Props) => (
  <PrivateNode authenticated={authenticated}>
    <span data-testid="private-node" />
  </PrivateNode>
)

test('When &:authenticated is :false or :undefined', () => {
  render(<CustomNode />)
  expect(screen.queryByTestId('private-node')).toBeNull()
})

test('When &:authenticated is :true', () => {
  render(<CustomNode authenticated />)
  expect(screen.getByTestId('private-node')).toBeInTheDocument()
})
