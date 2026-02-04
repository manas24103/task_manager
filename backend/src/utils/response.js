const successResponse = (message, data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

const errorResponse = (message, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return response;
};

const paginatedResponse = (message, data, pagination) => {
  return {
    success: true,
    message,
    data,
    pagination
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
