import { Input, type InputProps } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useFormContext } from "../../Form";
import { useFormFieldContext } from "../FormField";

export function TextInput({
  secret,
  inputRef,
  autocomplete,
  ...props
}: TextInputProps) {
  const context = useFormFieldContext(),
    formContext = useFormContext(),
    ref = useRef<HTMLElement>();

  useEffect(() => {
    if (ref.current && formContext.options.initialFocus === context?.id) {
      ref.current.focus();
    }
  }, []);

  return (
    <Input
      ref={ref as any}
      type={secret ? "password" : "text"}
      name={`${formContext?.id}-${context?.id}`}
      variant="outline"
      autoComplete={autocomplete ? autocomplete : undefined}
      aria-required={context?.required}
      {...props}
    />
  );
}

export interface TextInputProps extends InputProps {
  secret?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  autocomplete?: string;
}
