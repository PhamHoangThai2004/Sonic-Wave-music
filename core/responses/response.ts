import { HttpError } from "../exceptions/http-error.ts";

export function success(data: unknown, message = "Success") {
  return Response.json({
    code: 200,
    data,
    message,
    status: true,
  });
}

export function handleError(error: unknown): Response {
  if (error instanceof HttpError) {
    return new Response(
      JSON.stringify({
        code: error.status,
        message: error.message,
        status: false,
      }),
      {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      code: 500,
      message: "Internal Server Error",
      status: false,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}