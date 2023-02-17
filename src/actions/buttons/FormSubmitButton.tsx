import { Button } from "@chakra-ui/react";
import { useFormContext } from "../../Form";

export function FormSubmitButton(props: FormSubmitButtonProps) {
  const { formik } = useFormContext();

  return (
    <Button
      variant="solid"
      colorScheme="brand"
      type="submit"
      isLoading={props.loading}
      width="full"
      onClick={() => {
        formik.submitForm();
      }}
    >
      {props.i18n ?? "Submit"}
    </Button>
  );
}

interface FormSubmitButtonProps {
  loading?: boolean;
  i18n?: string;
  hasCancel: boolean;
}
