import { Box, HStack, Switch, SwitchProps, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFormContext } from "../../Form";
import { useFormFieldContext } from "../FormField";

export const SwitchInput: React.FC<
  SwitchProps & {
    // this is a hack to actually get a label instead of it being passed to a <FormLabel /> :husk:
    placeholder?: string;
    icon?: React.ReactNode;
    set?: boolean;
  }
> = ({ placeholder: label, icon, set = false }) => {
  const context = useFormFieldContext(),
    formContext = useFormContext();

  useEffect(() => {
    formContext.setField(context.id, set.toString());
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
        defaultChecked={set}
      />
    </HStack>
  );
};
