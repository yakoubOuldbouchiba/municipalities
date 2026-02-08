import { AxiosError } from 'axios';
import i18n from '../i18n/config';

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  required_roles?: string[];
  status?: number;
}

/**
 * Handles API errors with i18n support
 * @param error - The axios error
 * @param defaultMessage - Default message if no error message is available
 * @returns Translated error message
 */
export const getErrorMessage = (
  error: AxiosError<ApiErrorResponse> | any,
  defaultMessage?: string
): string => {
  try {
    if (error.response?.status === 403) {
      return i18n.t('errors.forbidden_403');
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    if (error.message) {
      return error.message;
    }

    return defaultMessage || i18n.t('errors.forbidden_message');
  } catch {
    return defaultMessage || 'An error occurred';
  }
};

/**
 * Extract required roles from API error response
 * @param error - The axios error
 * @returns Array of required roles
 */
export const getRequiredRoles = (error: AxiosError<ApiErrorResponse> | any): string[] => {
  try {
    return error.response?.data?.required_roles || [];
  } catch {
    return [];
  }
};

/**
 * Check if error is a 403 Forbidden error
 * @param error - The axios error
 * @returns Boolean indicating if it's a 403 error
 */
export const is403Error = (error: AxiosError<ApiErrorResponse> | any): boolean => {
  return error?.response?.status === 403;
};

/**
 * Create a formatted error object from API response
 * @param error - The axios error
 * @returns Formatted error object
 */
export const formatApiError = (
  error: AxiosError<ApiErrorResponse> | any
): {
  message: string;
  requiredRoles: string[];
  is403: boolean;
  status: number | undefined;
} => {
  return {
    message: getErrorMessage(error),
    requiredRoles: getRequiredRoles(error),
    is403: is403Error(error),
    status: error?.response?.status,
  };
};
