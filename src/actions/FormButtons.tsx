import { VStack } from "@chakra-ui/react";
import { useFormContext } from "../Form";
import FormHeading from "../FormHeading";
import FormCancelButton from "./buttons/FormCancelButton";
import FormSubmitButton from "./buttons/FormSubmitButton";

export default function FormButtons(props: FormButtonsProps) {
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
      <FormHeading.Error textAlign="left" />
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
