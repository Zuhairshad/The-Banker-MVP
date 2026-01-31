type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const getCurrentLogLevel = (): LogLevel => {
    if (typeof window === 'undefined') {
        return (process.env['LOG_LEVEL'] as LogLevel) ?? 'info';
    }
    return 'info';
};

const shouldLog = (level: LogLevel): boolean => {
    const currentLevel = getCurrentLogLevel();
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const formatMessage = (level: LogLevel, message: string, data?: unknown): LogMessage => ({
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
});

const logToConsole = (logMessage: LogMessage): void => {
    const { level, message, timestamp, data } = logMessage;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
        case 'debug':
            if (data !== undefined) {
                // eslint-disable-next-line no-console
                console.debug(prefix, message, data);
            } else {
                // eslint-disable-next-line no-console
                console.debug(prefix, message);
            }
            break;
        case 'info':
            if (data !== undefined) {
                // eslint-disable-next-line no-console
                console.info(prefix, message, data);
            } else {
                // eslint-disable-next-line no-console
                console.info(prefix, message);
            }
            break;
        case 'warn':
            if (data !== undefined) {
                console.warn(prefix, message, data);
            } else {
                console.warn(prefix, message);
            }
            break;
        case 'error':
            if (data !== undefined) {
                console.error(prefix, message, data);
            } else {
                console.error(prefix, message);
            }
            break;
    }
};

export const logger = {
    debug: (message: string, data?: unknown): void => {
        if (shouldLog('debug')) {
            logToConsole(formatMessage('debug', message, data));
        }
    },
    info: (message: string, data?: unknown): void => {
        if (shouldLog('info')) {
            logToConsole(formatMessage('info', message, data));
        }
    },
    warn: (message: string, data?: unknown): void => {
        if (shouldLog('warn')) {
            logToConsole(formatMessage('warn', message, data));
        }
    },
    error: (message: string, data?: unknown): void => {
        if (shouldLog('error')) {
            logToConsole(formatMessage('error', message, data));
        }
    },
};
