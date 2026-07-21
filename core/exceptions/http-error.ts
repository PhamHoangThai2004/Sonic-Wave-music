export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export class BadRequest extends HttpError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class Unauthorized extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class Forbidden extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFound extends HttpError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

export class MethodNotAllowed extends HttpError {
  constructor(message = "Method Not Allowed") {
    super(405, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}