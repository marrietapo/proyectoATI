export function minLengthValidation(inputData, minLength) {
  const { value } = inputData;

  return value.length >= minLength
}

export function emailValidation(inputData, minLength) {
  const emailValid =
    // eslint-disable-next-line no-useless-escape
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  const { value } = inputData;

  return emailValid.test(value)
}

