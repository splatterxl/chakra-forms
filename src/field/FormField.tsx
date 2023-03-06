import { Box, FormControl, FormControlProps } from "@chakra-ui/react";
import React, {
  ChangeEvent,
  ComponentType,
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createAutocompleteString } from "../autocomplete/createAutocompleteString";
import type { FormInputAutocomplete } from "../autocomplete/FormInputAutocompleteTypes";
import { useFormContext, validateField } from "../Form";
import { SchemaValidator } from "../validate";
import { FormLabel } from "./FormLabel";

const Context = createContext<FormFieldContext>(null as any);

export function useFormFieldContext() {
  return useContext(Context);
}

export interface FormFieldContext {
  id: string;
  placeholder?: string;
  required?: boolean;
  value: string;
}

export interface FormFieldInputProps {
  onChange: (event: ChangeEvent) => void;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  autocomplete?: string;
  inputRef: RefObject<any>;
}

/**
 * A single form field. The value passed by the user to this field will be reflected in the `values` object in the form's `onSubmit`.
 * 
 * The default inputs available are: {@link TextInput}, {@link PasswordInput} and {@link SwitchInput}. Otherwise you can implement your own, but make sure they support all of the {@link FormFieldInputProps}.
 * 
 * @example
	<FormField
		as={TextInput}
		id="username"
		label="Email"
		defaultValue="test@example.com"
		autocomplete={{
			type: FormInputAutocompleteTypes.USERNAME
		}}
		schema={{ email: true }}
		required
	/>
 * @param props Options for this field.
 */
export function FormField<
  Component extends React.ComponentType,
  Props = React.ComponentProps<Component>
>({
  as: As,
  id,
  value,
  defaultValue,
  required,
  validate,
  schema,
  disabled,
  placeholder,
  label,
  setValue,
  autocomplete,
  children,
  error,
  inputProps,
  ...props
}: FormFieldProps<Props, Component> &
  Omit<FormControlProps, keyof FormFieldProps<Props, Component>>) {
  const context = useFormContext(),
    fieldData = context.fields[id],
    [hasRegistered, setHasRegistered] = useState(false),
    [state, setState] = useState(defaultValue || ""),
    ref = useRef(null);

  useEffect(() => {
    if (!hasRegistered) {
      setHasRegistered(true);

      context.setField(id, value ?? defaultValue ?? "", {
        required: required,
        validate: validate,
        schema: schema,
      });
    }

    if (error) {
      context.setFieldError(id, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!As) {
    throw new Error("FormField must have an `as` prop");
  }

  const err = fieldData?.error;

  return (
    <FormControl
      isDisabled={disabled}
      isInvalid={!!fieldData?.error}
      isRequired={required}
      marginTop={0}
      {...props}
    >
      <Context.Provider
        value={{
          id: id,
          placeholder: placeholder,
          required: required,
          value: value ?? state,
        }}
      >
        {label && <FormLabel for={id} text={label} />}

        {/* @ts-ignore */}
        <As
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            context.handleChange(event, id);
            (setValue ?? setState)(event.target.value);

            if (fieldData?.error) {
              const error = validateField({
                data: fieldData,
                key: id,
                value: event.target.value,
                i18n: context.i18n,
              });

              context.setFieldError(id, error);
            }
          }}
          defaultValue={defaultValue}
          value={value ?? context.values[id]}
          placeholder={placeholder /* ?? label */}
          autocomplete={autocomplete && createAutocompleteString(autocomplete)}
          inputRef={ref}
          {...inputProps}
        >
          {children}
        </As>
        {err ? (
          <Box as="span" color="red.500" fontSize="sm" mt={5} marginLeft={1}>
            {/* @ts-ignore */}
            {typeof err === "string" ? err : err.toString() ?? "Invalid value"}
          </Box>
        ) : null}
      </Context.Provider>
    </FormControl>
  );
}

/**
 * Specific behaviour/configuration this form field should conform to.
 */
export interface FormFieldProps<
  ComponentProps,
  Component extends React.ComponentType
> {
  /**
   * Unique ID for this field.
   * @required
   */
  id: string;
  children?: React.ReactNode;
  /**
   * Textual label for this field. It's recommended to keep this for accessibility.
   */
  label?: string;
  /**
   * Supply your own error message if needed.
   */
  error?: string | null;
  /**
   * Provide an example or specific instructions to the user, or use this as a less accessible but sometimes cleaner label.
   * @example "Enter an email address"
   */
  placeholder?: string;
  /**
   * Prefilled value for the field. This will be passed to the {@link FormFieldProps.as component} you pass.
   */
  defaultValue?: string;
  /**
   * Instructs the browser how to autocomplete this field.
   * @see {FormInputAutocompleteTypes}
   * @example
   * ```ts
   * {
   * 	 type: FormInputAutocompleteTypes.CURRENT_PASSWORD
   * }
   * ```
   */
  autocomplete?: FormInputAutocomplete;
  /**
   * Whether this field is required from a user.
   * @default false
   */
  required?: boolean;
  /**
   * Whether this field is disabled. The value will still be sent to `onSubmit`.
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom function to validate the input. The function must throw an error or it will be assumed the value passes validation.
   * @example
   * (value) => {
   * 	 if (value === 'wrong') throw "Incorrect answer."
   * }
   */
  validate?: (value: string) => void;
  /**
   * Basic schema for the value.
   * @example
   * ```ts
   * { // length must be greater than 3
   * 	 gt: 3
   * }
   * ```
   */
  schema?: SchemaValidator;
  as: ComponentType<ComponentProps>;
  inputProps?: ComponentProps;
  value?: string;
  setValue?: (value: string) => void;
}
