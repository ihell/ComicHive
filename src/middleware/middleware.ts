import { Context, Next } from "hono";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("x-token");
  if(!token) {
    throw new HTTPException(401, {
      message: "Unauthorized"
    }) 
  }
  const user = await prismaClient.user.findFirst({
    where: {
      token: token,
    },
  });
  if (!user) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  c.set('token', token);
  c.set('userId', user.id)
  return next();
};
