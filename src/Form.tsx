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
import { FormFooter } from "./FormFooter";
import { SchemaValidator, validate } from "./validate";

const Context = createContext<FormContext>(null as any);

export interface FormContext {
  id: string;

  formik: FormikProps<Record<string, any>>;
  handleChange: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
  get values(): Record<string, string>;

  error: string | Error | null;
  setError: (error: string | null) => void;

  loading: boolean;

  fields: {
    [key: string]: {
      error?: string | null;
      required?: boolean;
      validate?: (value: string) => void;
      schema?: SchemaValidator;
    };
  };
  setField: (
    id: string,
    value: string,
    options?: FormContext["fields"]["string"]
  ) => void;
  setFieldError: (id: string, error: string | null) => void;

  actions: {
    cancel?: () => void;
  };

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

  showRequiredSign = true,
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
      showRequiredSign,
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
        {!customButtons ? (
          <FormFooter>
            <FormButtons loading={formik.isSubmitting} />
          </FormFooter>
        ) : null}
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
  children: React.ReactNode;
  id: string;

  i18n?: {
    cancel?: string;
    submit?: string;
    required?: string | Record<string, string>;
    invalid?: string | Record<string, string>;
  };

  onCancel?: () => void;
  onSubmit: (this: FormContext, values: Record<string, string>) => void;

  showRequiredSign?: boolean;
  initialFocus?: string;
  customButtons?: boolean;
}
