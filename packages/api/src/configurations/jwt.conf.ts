
export const JWT_SECRET: string = process.env.JWT_SECRET as string;

export const JWT_EXPIRES_TIME = 1000 * 60 * 60 * 24 * 2; // 2 Days, in MS