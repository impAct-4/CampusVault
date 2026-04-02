import { toast } from 'sonner';

// Toast types and interfaces
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ErrorResponse {
  success?: boolean;
  error?: string;
  code?: string;
  message?: string;
  details?: any;
  requestId?: string;
}

// Error message mapper - maps error codes to user-friendly messages
const errorMessageMap: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'You need to log in to perform this action.',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND_ERROR: 'The requested resource was not found.',
  CONFLICT_ERROR: 'This resource already exists.',
  INSUFFICIENT_CREDITS_ERROR: 'You do not have enough credits for this action.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  TRANSACTION_ERROR: 'The transaction failed. Please try again.',
  SERVER_ERROR: 'An unexpected server error occurred. Please try again later.',
  PARSE_ERROR: 'Invalid request format. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Toast notification service
export const toastService = {
  // Success toast
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  },

  // Error toast with enhanced error handling
  error: (message: string | ErrorResponse, options?: ToastOptions) => {
    let displayMessage = message;
    let displayDescription = options?.description;

    if (typeof message === 'object') {
      // Extract error message from error response object
      displayMessage = message.error || message.message || 'An error occurred';
      
      // Provide user-friendly description based on error code
      if (!displayDescription && message.code) {
        displayDescription = errorMessageMap[message.code] || 'An unexpected error occurred.';
      }

      // Log full error details in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error Details:', {
          code: message.code,
          message: message.error,
          requestId: message.requestId,
          details: message.details,
        });
      }
    }

    toast.error(displayMessage as string, {
      duration: options?.duration || 5000,
      description: displayDescription,
      action: options?.action,
    });
  },

  // Info toast
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  },

  // Warning toast
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  },

  // Loading toast with promise support
  loading: (message: string, promise?: Promise<any>) => {
    if (promise) {
      return toast.promise(
        promise,
        {
          loading: message,
          success: (data) => {
            return data?.message || 'Operation completed successfully';
          },
          error: (err) => {
            const errorData = err?.response?.data;
            return errorData?.error || 'Operation failed';
          },
        }
      );
    }
    return toast.loading(message);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },

  // Custom action toast
  action: (
    message: string,
    actionLabel: string,
    onAction: () => void,
    options?: ToastOptions
  ) => {
    toast(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: {
        label: actionLabel,
        onClick: onAction,
      },
    });
  },
};

// HTTP status code to user-friendly message mapper
const httpStatusMap: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'You are not authenticated. Please log in.',
  402: 'You do not have enough credits for this action.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This resource already exists.',
  500: 'Server error occurred. Please try again later.',
  502: 'Service temporarily unavailable. Please try again.',
  503: 'Service is under maintenance. Please try again later.',
};

// Parse error from various sources and show appropriate toast
export const handleError = (error: any, customMessage?: string) => {
  if (!error) {
    toastService.error('An unexpected error occurred.');
    return;
  }

  // Handle Axios error
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as ErrorResponse;

    const message =
      customMessage ||
      data.error ||
      data.message ||
      httpStatusMap[status] ||
      'An error occurred';

    toastService.error(data, {
      description: customMessage,
    });
  }
  // Handle network error
  else if (error.message === 'Network Error') {
    toastService.error('Network error. Please check your connection.', {
      description: 'Unable to connect to the server. Please try again.',
    });
  }
  // Handle other errors
  else {
    toastService.error(customMessage || error.message || 'An unexpected error occurred.');
  }
};

export default toastService;