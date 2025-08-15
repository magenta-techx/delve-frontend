export const emailValidator = (value: string): string | undefined => {
  let error: string | undefined;
  if (!value) {
    error = 'Email Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
};
