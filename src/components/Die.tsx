import { useState } from "react";

interface Props {
  value: number;
  locked: boolean;
}

const Die = ({ value, locked }: Props) => {
  return (
    <div
      className={
        locked
          ? "border border-2 border-success border-opacity-75 rounded-2 p-2"
          : "border border-2 border-danger border-opacity-50 rounded-2 p-2"
      }
    >
      {value}
    </div>
  );
};

export default Die;
