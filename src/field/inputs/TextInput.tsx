import { Input, type InputProps } from "@chakra-ui/react";
import { useRef } from "react";
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

  return (
    <Input
      ref={ref as any}
      type={secret ? "password" : "text"}
      name={`${formContext?.id}-${context?.id}`}
      variant="outline"
      autoComplete={autocomplete ? autocomplete : undefined}
      aria-required={context?.required}
      bgColor="bg-surface"
      className="splt-form-input"
      {...props}
    />
  );
}

export interface TextInputProps extends InputProps {
  secret?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  autocomplete?: string;
}
