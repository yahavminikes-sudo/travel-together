import { Request, Response, NextFunction } from 'express';

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  GRAY: '\x1b[90m',
  CYAN: '\x1b[36m'
};

const getStatusColor = (code: number) => {
  if (code >= 500) return COLORS.RED;
  if (code >= 400) return COLORS.YELLOW;
  if (code >= 300) return COLORS.GRAY;
  return COLORS.GREEN;
};

const getDurationColor = (ms: number) => {
  if (ms > 500) return COLORS.RED;
  if (ms > 200) return COLORS.YELLOW;
  return COLORS.GRAY;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const timestamp = new Date().toISOString();

    const statusColor = getStatusColor(statusCode);
    const durationColor = getDurationColor(duration);

    const parts = [
      `${COLORS.GRAY}[${timestamp}]${COLORS.RESET}`,
      `${COLORS.CYAN}${method.padEnd(7)}${COLORS.RESET}`,
      url.padEnd(30),
      `${statusColor}${statusCode}${COLORS.RESET}`,
      `${durationColor}(${duration}ms)${COLORS.RESET}`
    ];

    console.log(parts.join(' '));
  });

  next();
};
