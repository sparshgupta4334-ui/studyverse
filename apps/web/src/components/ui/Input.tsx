"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-gray-500">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-surface-50 px-3 py-2.5 text-sm text-gray-100",
              "border-white/10 placeholder:text-gray-600",
              "transition-colors duration-200",
              "focus:border-brand-500/60 focus:outline-none focus:ring-1 focus:ring-brand-500/40",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              error && "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/40",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex items-center">{rightElement}</span>
          )}
        </div>
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
