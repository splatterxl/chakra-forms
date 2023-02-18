import { VStack } from "@chakra-ui/react";
import { useFormContext } from "../Form";
import { FormError } from "../FormHeading";
import { FormCancelButton } from "./buttons/FormCancelButton";
import { FormSubmitButton } from "./buttons/FormSubmitButton";

export function FormButtons(props: FormButtonsProps) {
  const {
    actions: { cancel },
    i18n: { submit },
  } = useFormContext();

  return (
    <VStack
      align="center"
      justifyContent={cancel ? "space-between" : "center"}
      flexDir="column"
      width={cancel ? "auto" : "full"}
      pb={4}
    >
      <FormError textAlign="left" />
      <FormSubmitButton
        loading={props.loading}
        i18n={submit}
        hasCancel={!!cancel}
      />
      {cancel ? <FormCancelButton /> : null}
    </VStack>
  );
}

interface FormButtonsProps {
  loading?: boolean;
}
