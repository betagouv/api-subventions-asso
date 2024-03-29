export const REGEX_PASSWORD = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!#@$%^&(){}[\]:;<>,.?/~_+=|-]).{8,32}$/;

export const REGEX_MAIL =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

export const REGEX_MAIL_DOMAIN = /^@?(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

export const DEFAULT_PWD = "TMP_PASSWOrd;12345678";
