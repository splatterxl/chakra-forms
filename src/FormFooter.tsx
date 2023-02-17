import { Box } from "@chakra-ui/react";

export function FormFooter({ children, br }: FormFooterProps) {
  return <Box w="full">{children}</Box>;
}

interface FormFooterProps {
  children: React.ReactNode;
  br?: number;
}
