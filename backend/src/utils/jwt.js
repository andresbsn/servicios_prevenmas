import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "change_me";

export const signToken = (payload) => jwt.sign(payload, secret, { expiresIn: "8h" });

export const verifyToken = (token) => jwt.verify(token, secret);
