# chakra-forms

Simple reusable form library for my projects.

## Installation

```sh
yarn add @splatterxl/chakra-forms
```

## Example

```tsx
const MyForm = () => {
  return (
    <Form
      id="login"
      onSubmit={(values) => {
        console.log(values.username, values.password);
      }}
      initialFocus="username"
    >
      <FormBody>
        <FormField
          as={TextInput}
          id="username"
          label="Email"
          defaultValue="test@example.com"
          autocomplete={{
            type: FormInputAutocompleteTypes.USERNAME,
          }}
          schema={{ email: true }}
          required
        />
        <FormField
          as={PasswordInput}
          id="password"
          label="Password"
          autocomplete={{
            type: FormInputAutocompleteTypes.CURRENT_PASSWORD,
          }}
          required
        />
      </FormBody>
    </Form>
  );
};
```

## Documentation

- [Website](https://splatterxl.github.io/chakra-forms)
