import {
  Box,
  HStack,
  InputProps,
  TagCloseButtonProps,
  TagLabelProps,
  TagProps,
  VStack,
} from "@chakra-ui/react";
import {
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useFormContext } from "../../../Form";
import { useFormFieldContext } from "../../FormField";
import { TextInput } from "../TextInput";
import type { MaybeFunc } from "./maybe";
import { maybeCall } from "./maybe";
import ChakraTagInputTag from "./Tag";

type MaybeIsInputProps<P> = MaybeFunc<[isInput: boolean, index?: number], P>;
type MaybeTagProps<P> = MaybeFunc<[tag: string, index?: number], P>;

export type ChakraTagInputProps = InputProps & {
  addKeys?: string[];

  tagProps?: MaybeTagProps<TagProps>;
  tagLabelProps?: MaybeTagProps<TagLabelProps>;
  tagCloseButtonProps?: MaybeTagProps<TagCloseButtonProps>;

  maxItems?: number;
};

export const TagInput = forwardRef(function ChakraTagInput(
  {
    addKeys = ["Enter"],
    tagProps,
    tagLabelProps,
    tagCloseButtonProps,
    maxItems = 50,
    ...props
  }: ChakraTagInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const formContext = useFormContext();
  const context = useFormFieldContext();

  const [tags, setTags] = useState<string[]>([]);

  const addTag = useCallback(
    (event: SyntheticEvent, tag: string) => {
      if (event.isDefaultPrevented() || tags.length >= maxItems) return;

      setTags((tags) => tags.concat([tag]));
    },
    [tags]
  );
  const removeTag = useCallback(
    (event: SyntheticEvent, index: number) => {
      if (event.isDefaultPrevented()) return;

      setTags((tags) => [...tags.slice(0, index), ...tags.slice(index + 1)]);
    },
    [tags]
  );
  const handleRemoveTag = useCallback(
    (index: number) => (event: SyntheticEvent) => {
      removeTag(event, index);
    },
    [removeTag]
  );
  const onKeyDown = props.onKeyDown;
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.isDefaultPrevented()) return;
      if (event.isPropagationStopped()) return;

      const { currentTarget, key } = event;
      const { selectionStart, selectionEnd } = currentTarget;
      if (addKeys.indexOf(key) > -1 && currentTarget.value) {
        addTag(event, currentTarget.value);
        if (!event.isDefaultPrevented()) {
          currentTarget.value = "";
        }
        event.preventDefault();
      } else if (
        key === "Backspace" &&
        tags.length > 0 &&
        selectionStart === 0 &&
        selectionEnd === 0
      ) {
        removeTag(event, tags.length - 1);
      }
    },
    [addKeys, tags.length, addTag, removeTag, onKeyDown]
  );

  useEffect(() => {
    formContext.setField(context.id, tags);
  }, [tags]);

  return (
    <VStack align="center">
      <TextInput
        onKeyDown={handleKeyDown}
        placeholder={
          maxItems
            ? props.placeholder ?? `Up to ${maxItems} tags`
            : props.placeholder
        }
        _placeholder={{ color: "gray.500", fontSize: "sm" }}
      />
      <HStack w="full" flexWrap="wrap" spacing={0} gap={2}>
        {tags.map((tag, index) => (
          <Box key={index}>
            <ChakraTagInputTag
              onRemove={handleRemoveTag(index)}
              tagLabelProps={maybeCall(tagLabelProps, tag, index)}
              tagCloseButtonProps={maybeCall(tagCloseButtonProps, tag, index)}
              colorScheme={props.colorScheme}
              size={props.size}
              {...maybeCall(tagProps, tag, index)}
            >
              {tag}
            </ChakraTagInputTag>
          </Box>
        ))}
      </HStack>
    </VStack>
  );
});
