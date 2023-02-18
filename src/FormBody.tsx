import { StackProps, VStack } from "@chakra-ui/react";

export function FormBody(props: FormBodyProps) {
  return <VStack mb={5} mt={2} spacing={2} w="full" {...props} />;
}

export interface FormBodyProps extends StackProps {}
