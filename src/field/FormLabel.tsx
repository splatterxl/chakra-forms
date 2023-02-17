import { FormLabel as ChakraFormLabel } from "@chakra-ui/react";
import { useFormContext } from "../Form";

export function FormLabel(props: FormLabelProps) {
  const context = useFormContext();

  return (
    <ChakraFormLabel htmlFor={`${context.id}-${props.for}`}>
      {props.text}
    </ChakraFormLabel>
  );
}

interface FormLabelProps {
  for: string;
  text: string;
  // this field isn't sent, it's kept for if we decide to redesign errors to be in labels again
  error?: string | null;
}
