import React from 'react'

type TextProps = {
  className?: string
  input: React.HTMLProps<HTMLInputElement>
  label: React.HTMLProps<HTMLLabelElement> & {
    val: string
  }
}

export const Text = ({ className, input, label: { val, ...props } }: TextProps) => (
  <div className={`field ${className || ''}`}>
    <label aria-label={val} {...props}>{val}</label>
    <input {...input} />
  </div>
)
