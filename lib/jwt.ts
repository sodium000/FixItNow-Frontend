/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";

const ACCESS_SECRET =
  process.env.NEXT_PUBLIC_JWT_ACCESS_EXPIRES_SECRET || "access_secret";
const REFRESH_SECRET =
  process.env.NEXT_PUBLIC_JWT_REFRESH_EXPIRES_SECRET || "refresh_secret";

const generateToken = (
  payload: object,
  secret: string,
  expiresIn: string | number = "1d",
) => {
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const verifyAndRefreshToken = (
  accessToken: string | undefined,
  refreshToken: string | undefined,
  accessSecret: string = ACCESS_SECRET,
  refreshSecret: string = REFRESH_SECRET,
) => {
  // First try verifying the access token
  if (accessToken) {
    const accessResult = verifyToken(accessToken, accessSecret);
    if (accessResult.success) {
      return {
        success: true,
        isRefreshed: false,
        accessToken,
        data: accessResult.data,
      };
    }
  }

  // Access token is missing or expired/invalid, check refresh token
  if (refreshToken) {
    const refreshResult = verifyToken(refreshToken, refreshSecret);
    if (
      refreshResult.success &&
      typeof refreshResult.data === "object" &&
      refreshResult.data !== null
    ) {
      const payload = { ...refreshResult.data };
      delete (payload as any).exp;
      delete (payload as any).iat;
      delete (payload as any).nbf;
      delete (payload as any).jti;

      const newAccessToken = generateToken(payload, accessSecret, "1d");
      return {
        success: true,
        isRefreshed: true,
        accessToken: newAccessToken,
        data: jwt.decode(newAccessToken),
      };
    }
  }

  return {
    success: false,
    error:
      "Access token validation ended and refresh token is invalid or missing.",
  };
};

export const jwtUtils = {
  generateToken,
  verifyToken,
  verifyAndRefreshToken,
};
