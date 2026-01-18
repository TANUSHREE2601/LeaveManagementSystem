/**
 * Centralized error handling utility for frontend
 */
export const handleApiError = (error) => {
  if (!error.response) {
    // Network error or no response
    let message = 'Network error. Please check your internet connection and try again.';
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      message = 'Cannot connect to the server. Please ensure the backend server is running on port 5000.';
    } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      message = 'Request timed out. The server is taking too long to respond.';
    } else if (error.message) {
      message = `Network error: ${error.message}`;
    }
    
    return {
      message,
      status: 0,
      type: 'network',
    };
  }

  const { status, data } = error.response;

  // Extract error message
  let message = 'An unexpected error occurred. Please try again.';
  
  if (data?.message) {
    message = data.message;
  } else if (data?.errors && Array.isArray(data.errors)) {
    // Handle validation errors
    message = data.errors.map(err => err.message || err.msg).join(', ');
  }

  // Categorize error types
  const errorType = getErrorType(status);

  return {
    message,
    status,
    type: errorType,
    errors: data?.errors || null,
    data: data?.data || null,
  };
};

/**
 * Get error type based on HTTP status code
 */
const getErrorType = (status) => {
  if (status >= 400 && status < 500) {
    if (status === 401) return 'authentication';
    if (status === 403) return 'authorization';
    if (status === 404) return 'not_found';
    if (status === 409) return 'conflict';
    if (status === 422) return 'validation';
    return 'client_error';
  }
  
  if (status >= 500) {
    return 'server_error';
  }

  return 'unknown';
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error) => {
  const handledError = handleApiError(error);
  return handledError.message;
};
