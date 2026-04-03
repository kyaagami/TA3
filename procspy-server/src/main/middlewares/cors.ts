import env from "@main/config/env";
import { NextFunction, Request, Response } from "express";

export default function corsMiddleware(req: Request, res: Response, next: NextFunction):void {

  const allowedOrigins = [
    ...env.allowedOrigins,
    'null', // Chrome extension
  ];
  const origin = req.headers.origin!;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return; 
  }

  next();
}
