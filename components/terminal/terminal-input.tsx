"use client";

import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Prompt } from "./terminal-output";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  disabled?: boolean;
}

/**
 * The prompt line. A real (but visually hidden) `<input>` sits over a mirrored
 * rendering of its text with a block caret, so we get a proper terminal look
 * while keeping native editing, mobile keyboards, IME, and accessibility.
 *
 * The hidden input is 16px so iOS doesn't zoom the page on focus.
 */
export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({ value, onChange, onKeyDown, onFocus, disabled }, ref) {
    const [caret, setCaret] = useState(0);
    const [focused, setFocused] = useState(false);

    const pos = Math.min(caret, value.length);
    const before = value.slice(0, pos);
    const under = value.charAt(pos) || " ";
    const after = value.slice(pos + 1);

    const syncCaret = (el: HTMLInputElement) => setCaret(el.selectionStart ?? el.value.length);

    return (
      <div className="relative flex items-start">
        <Prompt />
        <div className="relative min-w-0 flex-1">
          {/* Mirror */}
          <div aria-hidden="true" className="whitespace-pre-wrap break-all font-semibold text-foreground">
            {before}
            <span
              className={cn(
                "inline-block min-w-[1ch] rounded-[2px]",
                focused ? "term-caret" : "term-caret-idle",
              )}
            >
              {under}
            </span>
            {after}
          </div>

          <input
            ref={ref}
            type="text"
            value={value}
            disabled={disabled}
            onChange={(e) => {
              onChange(e.target.value);
              syncCaret(e.target);
            }}
            onKeyDown={onKeyDown}
            onKeyUp={(e) => syncCaret(e.currentTarget)}
            onClick={(e) => syncCaret(e.currentTarget)}
            onSelect={(e) => syncCaret(e.currentTarget)}
            onFocus={(e) => {
              setFocused(true);
              syncCaret(e.currentTarget);
              onFocus?.();
            }}
            onBlur={() => setFocused(false)}
            aria-label="Terminal input"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="send"
            className="absolute inset-0 h-full w-full cursor-text bg-transparent text-base text-transparent caret-transparent opacity-0 outline-none"
          />
        </div>
      </div>
    );
  },
);
