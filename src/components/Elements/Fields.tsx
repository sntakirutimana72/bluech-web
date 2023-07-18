import React from "react"

type TextProps = {
  className?: string
  input: React.HTMLProps<HTMLInputElement> & {}
  label: React.HTMLProps<HTMLLabelElement> & {
    val: string|null
  }
}

export const Text = ({ className='field', input, label: { val, ...props } }: TextProps) => (
  <div className={className}>
    <label {...props}>{val}</label>
    <input {...input} />
  </div>
)
