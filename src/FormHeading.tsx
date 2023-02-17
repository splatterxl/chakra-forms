import {
	BoxProps,
	Heading,
	HeadingProps,
	Text,
	TextProps,
	VStack
} from '@chakra-ui/react';
import { useFormContext } from './Form';

export default function FormHeading(props: BoxProps) {
	return (
		<VStack spacing={0} px={0} pb={3} pt={2} width='full' {...props}>
			{props.children}
		</VStack>
	);
}

FormHeading.Title = function Title(props: HeadingProps) {
	return (
		<Heading fontWeight={900} textAlign='center' width='full' {...props} />
	);
};

FormHeading.Error = function Error(props: Omit<TextProps, 'children'>) {
	const {
		error,
		fields: { __root__ }
	} = useFormContext();

	if (!error && !__root__?.error) return null;

	return (
		<Text
			fontSize='sm'
			color='red.500'
			marginBottom={1.5}
			textAlign='center'
			width='full'
			{...props}
		>
			{(error ?? __root__.error)!.toString?.() ?? error}
		</Text>
	);
};

FormHeading.Description = function Description(props: TextProps) {
	return (
		<Text
			marginBottom={0}
			marginX={2}
			fontWeight={400}
			fontSize='1.1rem'
			textAlign='center'
			width='full'
			{...props}
		/>
	);
};
