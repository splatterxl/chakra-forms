import { Flex, type FlexProps } from "@chakra-ui/react";
import { FormikProps, useFormik } from "formik";
import {
  ChangeEvent,
  createContext,
  FormEventHandler,
  useContext,
  useState,
} from "react";
import { FormButtons } from "./actions/FormButtons";
import { SchemaValidator, validate } from "./validate";

const Context = createContext<FormContext>(null as any);

export interface FormContext {
  /**
   * The ID of this form
   */
  id: string;

  /**
   * The internal Formik instance
   */
  formik: FormikProps<Record<string, any>>;
  /**
   * Handle the changing of a field's value
   *
   * @param id The field's ID
   */
  handleChange: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
  /**
   * The current values associated with a field.
   */
  get values(): Record<string, string | string[] | File[]>;

  /**
   * Global error associated with the form.
   *
   * @see FormError
   */
  error: string | Error | null;
  /**
   * Set the global error for the form.
   */
  setError: (error: string | null) => void;

  /**
   * Whether the submit action for this form is still processing.
   */
  loading: boolean;

  /**
   * Field data for each field.
   */
  fields: {
    [key: string]: {
      error?: string | null;
      required?: boolean;
      validate?: (value: string) => void;
      schema?: SchemaValidator;
    };
  };
  /**
   * Set the field data for a field. Unrecommended that you tamper with this.
   */
  setField: (
    id: string,
    value: string | File[] | string[],
    options?: FormContext["fields"]["string"]
  ) => void;
  /**
   * Set the error for a field.
   */
  setFieldError: (id: string, error: string | null) => void;

  /**
   * This property provides a way to cancel the form and call `onCancel`.
   */
  actions: {
    cancel?: () => void;
  };

  /**
   * The custom button labels provided in {@link FormProps}
   */
  i18n: NonNullable<FormProps["i18n"]>;

  options: {
    showRequiredSign?: boolean;
    initialFocus?: string;
  };
}

export function useFormContext() {
  return useContext(Context);
}

/**
 * The main hub for the form. This component manages form state, the underlying formik instance and basic styling, etc.
 *
 * @example
  <Form
 		id="login"
 		onSubmit={(values: { username: string; password: string; }) => {}}
 		initialFocus="username"
 	>
 		<FormBody>
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
 			<FormField
 				as={PasswordInput}
 				id="password"
 				label="Password"
 				autocomplete={{
 					type: FormInputAutocompleteTypes.CURRENT_PASSWORD
 				}}
 				required
 			/>
 		</FormBody>
 	</Form>
 * @param props Settings for this form instance.
 * @returns A fully rendered form component you can drop into the page, with submitting, validation, etc. sorted for you.
 */
export function Form({
  children,
  id,
  i18n,

  onCancel,
  onSubmit,

  initialFocus,
  customButtons = false,

  ...props
}: FormProps) {
  const [, setRefresh] = useState(0);

  const formik = useFormik<Record<string, string>>({
    initialValues: {},
    onSubmit: async (values) => {
      let formHasErrors;

      for (const [key, data] of Object.entries(context.fields)) {
        const value = values[key],
          error = validateField({ data, key, value, i18n: context.i18n });

        if (error) {
          setFieldData(key, {
            error,
          });
          formHasErrors = true;
        } else {
          setFieldData(key, {
            error: undefined,
          });
        }
      }

      if (formHasErrors) {
        formik.setSubmitting(false);
        return;
      }

      try {
        await onSubmit.call(context, values);
      } catch (err: any) {
        setError(err?.toString?.() ?? err);
      }

      formik.setSubmitting(false);
    },
  });

  const [context, setContext] = useState<FormContext>({
    id,
    formik,
    handleChange: (event: ChangeEvent<any>, id: string) => {
      formik.setFieldValue(id, event.target.value);
      setRefresh((refresh) => refresh + 1);
    },
    get values() {
      return formik.values;
    },
    error: null,
    setError,
    loading: false,
    fields: {},
    setField(id, value, options) {
      formik.setFieldValue(id, value);
      if (options) setFieldData(id, options);
      setRefresh((refresh) => refresh + 1);
    },
    setFieldError(id, error) {
      setFieldData(id, {
        error,
      });
    },
    i18n: i18n ?? {},
    actions: {
      cancel: onCancel,
    },
    options: {
      initialFocus,
    },
  });

  function setFieldData(
    id: string,
    data: Partial<FormContext["fields"][string]>
  ) {
    setContext((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [id]: {
          ...prev.fields[id],
          ...data,
        },
      },
    }));
  }

  function setError(error: string | null) {
    setContext((prev) => ({
      ...prev,
      error,
    }));
  }

  return (
    <Context.Provider value={context}>
      <Flex
        as="form"
        justify="center"
        align="flex-start"
        flexDir="column"
        padding={0}
        onSubmit={formik.handleSubmit as FormEventHandler<any>}
        width="full"
        {...props}
      >
        {children}
        {!customButtons ? <FormButtons /> : null}
      </Flex>
    </Context.Provider>
  );
}

export function validateField({
  data,
  key,
  value,
  i18n,
}: {
  data: FormContext["fields"][string];
  key: string;
  value: string;
  i18n: FormContext["i18n"];
}) {
  if (data.required) {
    if (!value) {
      return (
        (typeof i18n.required === "object"
          ? i18n.required?.[key]
          : i18n.required) ?? "This field is required"
      );
    }
  }

  if (data.schema) {
    try {
      validate(value, data.schema);
    } catch (e) {
      return e;
    }
  }

  if (data.validate) {
    try {
      data.validate(value);
    } catch (e: any) {
      return e?.message ?? e ?? "Invalid value";
    }
  }
}

export interface FormProps extends Omit<FlexProps, "onSubmit"> {
  /**
   * Unique identifier for this form.
   */
  id: string;

  /**
   * Button internationalised values. Configure these to use customised labels for the form buttons.
   *
   * @example
   * {
   * 	 cancel: "Cancel",
   * 	 submit: "Submit",
   * 	 required: "This field is required."
   * }
   */
  i18n?: {
    cancel?: string;
    submit?: string;
    required?: string;
  };

  /**
   * Handle cancellation of the form. The cancel button is only shown if this function is defined.
   */
  onCancel?: () => void;
  /**
   * Handle submission of the form. It's let up to you to statically type the `values` parameter due to
   * technical limitations.
   *
   * @example
   * (values: { username: string; password: string; }) => {
   *	 console.log(values.username, values.password)
   * }
   */
  onSubmit: (this: FormContext, values: Record<string, string>) => void;

  /**
   * The ID of the field that should be initially focused when the form is mounted.
   */
  initialFocus?: string;
  /**
   * Whether to hide the default buttons and let you implement them seperately. This is best for wide forms to avoid a super wide submit button.
   */
  customButtons?: boolean;
}
