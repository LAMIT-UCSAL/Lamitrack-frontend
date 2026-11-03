import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import "./Button.scss";

type Variant = "primary" | "secondary";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  // A seta "→" anda 4px no hover. Por padrão, só o primário mostra.
  arrow?: boolean;
  className?: string;
};

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = AsLink | AsButton;

// CTA da LAMIT. Um primário (Signal Blue) por tela; os demais são secundários.
// Com href vira <a>; sem, <button type="button">.
export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    arrow = variant === "primary",
    className,
    ...rest
  } = props;
  const classes = ["button", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {children}
      {arrow && (
        <span className="button__arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
