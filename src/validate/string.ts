const validators = {
	email: {
		f: (str: string) => /.*@.*/.test(str),
		t: () => 'Invalid email address'
	},
	numeric: {
		f: (str: string) => /^\d+$/.test(str),
		t: () => 'Must be a numeric value'
	}
};

export default validators;

export type StringValidator = Record<keyof typeof validators, boolean>;
