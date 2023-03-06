import { ChangeEvent, TextareaHTMLAttributes } from "react";
import { useFormContext } from "../../Form";
import { FormFieldInputProps, useFormFieldContext } from "../FormField";

/**
 * Normal Chakra UI textarea.
 *
 * @param props Accepts any Chakra UI property.
 */
export function Textarea({
  inputRef,
  autocomplete,
  ...props
}: Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  keyof FormFieldInputProps
> &
  Partial<FormFieldInputProps>) {
  const context = useFormFieldContext(),
    formContext = useFormContext();

  const func = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    formContext.setField(context.id, value);
  };

  return (
    <textarea
      value={context.value}
      placeholder={context.placeholder}
      required={context.required}
      name={`${formContext.id}-${context.id}`}
      id={`${formContext.id}-${context.id}`}
      {...props}
      onChange={func}
      style={{
        resize: "vertical",
        backgroundColor: "var(--chakra-colors-bg-surface)",
        borderRadius: "var(--chakra-radii-md)",
        border: "1px solid",
        borderColor: "inherit",
        padding: "var(--chakra-space-3)",
        paddingLeft: "var(--chakra-space-4)",
        paddingRight: "var(--chakra-space-4)",
        ...(props.style ?? {}),
      }}
    />
  );
}
