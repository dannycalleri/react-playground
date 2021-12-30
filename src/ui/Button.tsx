import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const { children, ...buttonProps } = props;
  return <button {...buttonProps}>{children}</button>;
}
