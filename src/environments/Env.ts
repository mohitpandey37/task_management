export interface Environment {
  nodeEnv: string;
  dbUrl: string;
  baseUrl: string;
  USER_PASS : string
}

export function env(): Environment {
  return {
    nodeEnv: process.env.NODE_ENV,
    dbUrl: process.env.DB_URL,
    baseUrl: process.env.BASE_URL,
    USER_PASS: process.env.USER_PASS
  };
}
