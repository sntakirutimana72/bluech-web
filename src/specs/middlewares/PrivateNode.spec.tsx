import { render, screen } from '@testing-library/react'
import { PrivateNode } from '../../middlewares'

type Props = { authenticated?: boolean }

const CustomApp = ({ authenticated }: Props) => (
  <PrivateNode authenticated={authenticated}>
    <span data-testid="private-node" />
  </PrivateNode>
)

test('When &:authenticated is :false or :undefined', () => {
  render(<CustomApp />)
  expect(screen.queryByTestId('private-node')).not.toBeInTheDocument()
})

test('When &:authenticated is :true', () => {
  render(<CustomApp authenticated />)
  expect(screen.getByTestId('private-node')).toBeInTheDocument()
})
