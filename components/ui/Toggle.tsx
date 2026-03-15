"use client";

import { useCallback, useState } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, disabled }: ToggleProps) {
  const [localChecked, setLocalChecked] = useState(checked);

  const handleChange = useCallback(() => {
    if (disabled) return;
    const next = !localChecked;
    setLocalChecked(next);
    onChange(next);
  }, [localChecked, onChange, disabled]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={localChecked}
      onClick={handleChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        localChecked ? "bg-black" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          localChecked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
