import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
  color?: "primary" | "secondary" | "danger" | "warning";
  enabled?: boolean;
}

const Button = ({
  children,
  onClick,
  color = "primary",
  enabled = true,
}: Props) => {
  let classes = "m-2 btn btn-" + color;
  if (!enabled) {
    classes += " disabled";
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
