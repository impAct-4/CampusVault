export class APIError extends Error {
    statusCode;
    message;
    code;
    details;
    constructor(statusCode, message, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
        this.details = details;
        this.name = 'APIError';
    }
}
export class ValidationError extends APIError {
    constructor(message, details) {
        super(400, message, 'VALIDATION_ERROR', details);
    }
}
export class AuthenticationError extends APIError {
    constructor(message = 'Unauthorized access') {
        super(401, message, 'AUTHENTICATION_ERROR');
    }
}
export class AuthorizationError extends APIError {
    constructor(message = 'Access forbidden') {
        super(403, message, 'AUTHORIZATION_ERROR');
    }
}
export class NotFoundError extends APIError {
    constructor(resource = 'Resource') {
        super(404, `${resource} not found`, 'NOT_FOUND_ERROR');
    }
}
export class ConflictError extends APIError {
    constructor(message = 'Resource already exists') {
        super(409, message, 'CONFLICT_ERROR');
    }
}
export class InsufficientCreditsError extends APIError {
    constructor(required, available) {
        super(402, 'Insufficient credits', 'INSUFFICIENT_CREDITS_ERROR', { required, available });
    }
}
export class DatabaseError extends APIError {
    constructor(message = 'Database operation failed', details) {
        super(500, message, 'DATABASE_ERROR', details);
    }
}
export class TransactionError extends APIError {
    constructor(message = 'Transaction failed', details) {
        super(500, message, 'TRANSACTION_ERROR', details);
    }
}
export class ServerError extends APIError {
    constructor(message = 'Internal server error', details) {
        super(500, message, 'SERVER_ERROR', details);
    }
}
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', { name: err.name, message: err.message, stack: err.stack, url: req.url, method: req.method, timestamp: new Date().toISOString() });
    let statusCode = 500;
    let errorResponse = { success: false, error: 'Internal Server Error', code: 'SERVER_ERROR' };
    if (err instanceof APIError) {
        statusCode = err.statusCode;
        errorResponse = { success: false, error: err.message, code: err.code, ...(err.details && { details: err.details }) };
    }
    else if (err instanceof SyntaxError) {
        statusCode = 400;
        errorResponse = { success: false, error: 'Invalid JSON in request body', code: 'PARSE_ERROR' };
    }
    else {
        errorResponse = { success: false, error: err.message || 'An unexpected error occurred', code: 'UNKNOWN_ERROR' };
    }
    if (req.id) {
        errorResponse.requestId = req.id;
    }
    res.status(statusCode).json(errorResponse);
};
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
