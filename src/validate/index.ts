import string, { StringValidator } from '@/components/form/validate/string';
import len, { LengthValidator } from './len';

const validators = {
	...len,
	...string
};

export default validators;
export type SchemaValidator = Partial<LengthValidator & StringValidator>;

export function validate(value: string, schema: SchemaValidator) {
	for (const [K, V] of Object.entries(schema)) {
		if (!(K in validators)) {
			console.warn(`Unknown validator ${K}, handling value`, value);
			continue;
		} else if (V == undefined) {
			console.warn(
				`Validator ${K} for field is undefined, handling value`,
				value
			);
			continue;
		}

		const validator = validators[K as keyof typeof validators];

		if (
			// @ts-ignore
			(typeof validator.f === 'function' && !validator.f(value, V)) ||
			// @ts-ignore
			(typeof validator === 'function' && !validator(value, V))
		) {
			throw (
				// @ts-ignore
				validator.t?.({
					expected: V.toString(),
					value
				}) ?? 'Invalid value'
			);
		}
	}
}
