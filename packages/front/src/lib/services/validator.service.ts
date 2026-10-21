export const PWD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!#@$%^&(){}[\]:;<>,.?/~_+=|-]).{8,32}$/;
export const checkPassword = password => PWD_REGEX.test(password);
