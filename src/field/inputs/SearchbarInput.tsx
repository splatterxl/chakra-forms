import {
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { useFormContext } from "../../Form";
import { TextInput, TextInputProps } from "./TextInput";

export function SearchbarInput(props: TextInputProps) {
  const context = useFormContext();

  return (
    <InputGroup>
      <TextInput {...props} />
      <InputRightElement pr={3}>
        <IconButton
          type="submit"
          isLoading={context.loading}
          icon={<Icon as={AiOutlineSearch} />}
          aria-label="Search"
        />
      </InputRightElement>
    </InputGroup>
  );
}
