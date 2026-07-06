import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Field({ label, className = "", ...props }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <input
        className={`focus-ring min-h-11 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none ${className}`}
        {...props}
      />
    </label>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function TextArea({ label, className = "", ...props }: TextAreaProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <textarea
        className={`focus-ring min-h-44 resize-y rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 outline-none ${className}`}
        {...props}
      />
    </label>
  );
}
