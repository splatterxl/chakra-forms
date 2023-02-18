import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function FormFooter({ children }: PropsWithChildren) {
  return <Box w="full">{children}</Box>;
}
