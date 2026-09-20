export type TAuthFieldRequirements = {
  satisfied: string[];
  unsatisfied: string[];
};

export type TUsernameValidationLimits = {
  minimumUsernameLength: number;
  maximumUsernameLength: number;
};

export type TPasswordValidationLimits = {
  minimumPasswordLength: number;
  maximumPasswordLength: number;
};

const USERNAME_SPACES_MESSAGE =
  'The username must not contain any leading, trailing or inline spaces';
const USERNAME_HTML_CHARS_MESSAGE =
  'The username must not contain HTML special characters (e.g. &, <, >, ", \')';

const PASSWORD_LOWERCASE_MESSAGE = 'The password must contain at least one lowercase character';
const PASSWORD_UPPERCASE_MESSAGE = 'The password must contain at least one uppercase character';
const PASSWORD_NUMBER_MESSAGE = 'The password must contain at least one number';
const PASSWORD_SPECIAL_MESSAGE = 'The password must contain at least one special charcter';

const MINIMUM_EMAIL_LENGTH = 1;
const MAXIMUM_EMAIL_LENGTH = 254;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMAIL_REQUIREMENTS = {
  length: `The email must be between ${MINIMUM_EMAIL_LENGTH} and ${MAXIMUM_EMAIL_LENGTH} characters long`,
  'valid-email': 'The email must have a @ sign and a valid domain after it',
};

const SPECIAL_CHARACTER_REGEX = /[\W_]/;

export function buildUsernameRequirementMessages(limits: TUsernameValidationLimits) {
  return {
    length: `The username must be between ${limits.minimumUsernameLength} and ${limits.maximumUsernameLength} characters long`,
    spaces: USERNAME_SPACES_MESSAGE,
    'html-chars': USERNAME_HTML_CHARS_MESSAGE,
  };
}

export function buildPasswordRequirementMessages(limits: TPasswordValidationLimits) {
  return {
    length: `The password must be between ${limits.minimumPasswordLength} and ${limits.maximumPasswordLength} characters long`,
    lowercase: PASSWORD_LOWERCASE_MESSAGE,
    uppercase: PASSWORD_UPPERCASE_MESSAGE,
    number: PASSWORD_NUMBER_MESSAGE,
    'special-character': PASSWORD_SPECIAL_MESSAGE,
  };
}

export function getUsernameRequirements(
  username: string,
  limits: TUsernameValidationLimits,
): TAuthFieldRequirements {
  const requirements = buildUsernameRequirementMessages(limits);
  const satisfied: string[] = [];
  const unsatisfied: string[] = [];
  const hasSpaces = username.includes(' ');
  const hasHtmlSpecialChars = /[&<>"']/.test(username);
  const usernameLengthWithoutSpaces = username.replace(/\s/g, '').length;

  if (hasHtmlSpecialChars) {
    unsatisfied.push(requirements['html-chars']);
  } else {
    satisfied.push(requirements['html-chars']);
  }

  if (
    usernameLengthWithoutSpaces < limits.minimumUsernameLength ||
    usernameLengthWithoutSpaces > limits.maximumUsernameLength
  ) {
    unsatisfied.push(requirements.length);
  } else {
    satisfied.push(requirements.length);
  }

  if (hasSpaces) {
    unsatisfied.push(requirements.spaces);
  } else if (!username) {
    return {
      satisfied: [],
      unsatisfied: Object.values(requirements),
    };
  } else {
    satisfied.push(requirements.spaces);
  }

  return { satisfied, unsatisfied };
}

export function getPasswordRequirements(
  password: string,
  limits: TPasswordValidationLimits,
): TAuthFieldRequirements {
  const requirements = buildPasswordRequirementMessages(limits);
  const satisfied: string[] = [];
  const unsatisfied: string[] = [];

  if (password.length < limits.minimumPasswordLength || password.length > limits.maximumPasswordLength) {
    unsatisfied.push(requirements.length);
  } else {
    satisfied.push(requirements.length);
  }

  const hasUppercaseCharacter = /[A-Z]/.test(password);
  const hasLowercaseCharacter = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(password);

  if (hasLowercaseCharacter) satisfied.push(requirements.lowercase);
  else unsatisfied.push(requirements.lowercase);

  if (hasUppercaseCharacter) satisfied.push(requirements.uppercase);
  else unsatisfied.push(requirements.uppercase);

  if (hasNumber) satisfied.push(requirements.number);
  else unsatisfied.push(requirements.number);

  if (hasSpecialCharacter) satisfied.push(requirements['special-character']);
  else unsatisfied.push(requirements['special-character']);

  return { satisfied, unsatisfied };
}

export function getEmailRequirements(email: string): TAuthFieldRequirements {
  const satisfied: string[] = [];
  const unsatisfied: string[] = [];

  if (email.length < MINIMUM_EMAIL_LENGTH || email.length > MAXIMUM_EMAIL_LENGTH) {
    unsatisfied.push(EMAIL_REQUIREMENTS.length);
  } else {
    satisfied.push(EMAIL_REQUIREMENTS.length);
  }

  if (EMAIL_REGEX.test(email)) {
    satisfied.push(EMAIL_REQUIREMENTS['valid-email']);
  } else {
    unsatisfied.push(EMAIL_REQUIREMENTS['valid-email']);
  }

  return { satisfied, unsatisfied };
}

export function fileSizeInDecimalMb(bytes: number): number {
  return bytes / 1000 / 1000;
}
