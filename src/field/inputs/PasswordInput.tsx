import {
  IconButton,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import TextInput, { TextInputProps } from "./TextInput";

export const PasswordField = (props: TextInputProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <InputGroup>
      <InputRightElement>
        <IconButton
          variant="link"
          aria-label={isOpen ? "Mask password" : "Reveal password"}
          icon={!isOpen ? <HiEyeOff /> : <HiEye />}
          onClick={onClickReveal}
        />
      </InputRightElement>
      <TextInput
        paddingRight={8}
        type={isOpen ? "text" : "password"}
        {...props}
      />
    </InputGroup>
  );
};

export default PasswordField;

PasswordField.displayName = "PasswordField";
