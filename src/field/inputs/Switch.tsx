import { Box, HStack, Switch, SwitchProps, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFormContext } from "../../Form";
import { FormFieldInputProps, useFormFieldContext } from "../FormField";

/**
 * Experimental switch element. Untested so far.
 *
 * @param props Accepts any Chakra UI Switch property
 */
export const SwitchInput: React.FC<
  SwitchProps & {
    // this is a hack to actually get a label instead of it being passed to a <FormLabel /> :husk:
    placeholder?: string;
    icon?: React.ReactNode;
  } & FormFieldInputProps
> = ({ placeholder: label, icon, defaultValue = false, ...props }) => {
  const context = useFormFieldContext(),
    formContext = useFormContext();

  useEffect(() => {
    formContext.setField(context.id, defaultValue.toString());
  }, []);

  return (
    <HStack justify="space-between">
      <HStack as="label" htmlFor={`${formContext.id}-${context.id}`}>
        <Box>{icon}</Box>
        <Text as="span">{label}</Text>
      </HStack>
      <Switch
        onChange={(event) => {
          formContext.setField(context.id, event.target.checked.toString());
        }}
        id={`${formContext.id}-${context.id}`}
        colorScheme="green"
        _checked={{ bg: "green.600" }}
        defaultChecked={
          defaultValue === "false" ? false : Boolean(defaultValue)
        }
      />
    </HStack>
  );
};
