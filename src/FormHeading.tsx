import {
  Heading,
  HeadingProps,
  StackProps,
  Text,
  TextProps,
  VStack,
} from "@chakra-ui/react";
import { useFormContext } from "./Form";

/**
 * Container for the form heading.
 * @param props Normal stack props for Chakra UI
 *
 * @example
 * ```tsx
 * <FormHeading>
 *   <FormTitle>Login</FormTitle>
 *   <FormDescription>Log into your account here.</FormTitle>
 * </FormHeading>
 * ```
 */
export function FormHeading(props: StackProps) {
  return (
    <VStack spacing={0} px={0} pb={3} pt={2} width="full" {...props}>
      {props.children}
    </VStack>
  );
}

export function FormTitle(props: HeadingProps) {
  return (
    <Heading fontWeight={900} textAlign="center" width="full" {...props} />
  );
}

export function FormError(props: Omit<TextProps, "children">) {
  const {
    error,
    fields: { __root__ },
  } = useFormContext();

  if (!error && !__root__?.error) return null;

  return (
    <Text
      fontSize="sm"
      color="red.500"
      marginBottom={1.5}
      textAlign="center"
      width="full"
      {...props}
    >
      {(error ?? __root__.error)!.toString?.() ?? error}
    </Text>
  );
}

export function FormDescription(props: TextProps) {
  return (
    <Text
      marginBottom={0}
      marginX={2}
      fontWeight={400}
      fontSize="1.1rem"
      textAlign="center"
      width="full"
      {...props}
    />
  );
}
