import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import type { AuthUser } from "../types/auth.js";

export type AuthedRequest = Request & { auth?: AuthUser };

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice("Bearer ".length);
  jwt.verify(token, env.JWT_SECRET, (err, payload) => {
    if (!err && typeof payload === "object" && payload !== null) {
      const sub = "sub" in payload ? payload.sub : undefined;
      const email = "email" in payload ? payload.email : undefined;
      if (typeof sub === "string" && typeof email === "string") {
        (req as AuthedRequest).auth = { id: sub, email };
      }
    }
    next();
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token." });
  }

  const token = authHeader.slice("Bearer ".length);
  jwt.verify(token, env.JWT_SECRET, (err, payload) => {
    if (err || typeof payload !== "object" || payload === null) {
      return res.status(401).json({ message: "Invalid access token." });
    }
    const sub = "sub" in payload ? payload.sub : undefined;
    const email = "email" in payload ? payload.email : undefined;
    if (typeof sub !== "string" || typeof email !== "string") {
      return res.status(401).json({ message: "Invalid access token payload." });
    }
    (req as AuthedRequest).auth = { id: sub, email };
    next();
  });
}

