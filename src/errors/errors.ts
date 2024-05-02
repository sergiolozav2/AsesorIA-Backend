export class CustomError extends Error {
  constructor(
    public statusCode: number = 500,
    public message: string = 'Unknown error',
    public code: string = 'SERVER ERROR',
  ) {
    super(message);
  }
}

export class InvalidTokenError extends CustomError {
  constructor(statusCode = 403) {
    super(statusCode, 'INVALID_TOKEN');
  }
}

export class InsufficientPrivilegesError extends CustomError {
  constructor(
    statusCode = 403,
    message = 'Insufficient privileges to access resource',
  ) {
    super(statusCode, message, 'INSUFFICIENT_PRIVILEGES');
  }
}

export class InvalidLoginError extends CustomError {
  constructor(statusCode = 401, message = 'Email o contraseña incorrectos') {
    super(statusCode, message, 'LOGIN_FAILED');
  }
}
