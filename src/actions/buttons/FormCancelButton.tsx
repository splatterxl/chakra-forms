import { Button } from "@chakra-ui/react";
import { useFormContext } from "../../Form";

export default function FormCancelButton() {
  const {
    actions: { cancel },
    i18n: { cancel: cancelString = "Cancel" },
  } = useFormContext();

  return (
    <Button
      variant="link"
      w="full"
      size="md"
      fontWeight={500}
      color="muted"
      _hover={{ color: "subtle" }}
      onClick={() => {
        cancel!();
      }}
    >
      {cancelString}
    </Button>
  );
}
