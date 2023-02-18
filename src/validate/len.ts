export default {
  lt: (val: string, max: number) => val.length < max,
  gt: (val: string, min: number) => val.length > min,
  lte: (val: string, max: number) => val.length <= max,
  gte: (val: string, min: number) => val.length >= min,
  len: (val: string, len: number) => val.length === len,
};

export type LengthValidator = Record<
  `${`l` | `g`}t` | `${`l` | `g`}te` | "len",
  number | undefined
>;
