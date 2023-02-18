import { StackProps, VStack } from "@chakra-ui/react";

/**
 * Container for a form body. This is only really necessary if you're using a Chakra UI modal as well.
 */
export function FormBody(props: StackProps) {
  return <VStack mb={5} mt={2} spacing={2} w="full" {...props} />;
}
