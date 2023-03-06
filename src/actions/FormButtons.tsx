import { VStack } from "@chakra-ui/react";
import { useFormContext } from "../Form";
import { FormError } from "../FormHeading";
import { FormCancelButton } from "./buttons/FormCancelButton";
import { FormSubmitButton } from "./buttons/FormSubmitButton";

export function FormButtons() {
  const {
    actions: { cancel },
    i18n: { submit },
    loading,
  } = useFormContext();

  return (
    <VStack
      align="center"
      justifyContent={cancel ? "space-between" : "center"}
      flexDir="column"
      width="full"
      pb={4}
    >
      <FormError textAlign="left" />
      <FormSubmitButton loading={loading} i18n={submit} hasCancel={!!cancel} />
      {cancel ? <FormCancelButton /> : null}
    </VStack>
  );
}
