// Standard success response
exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Standard error response
exports.errorResponse = (res, message = 'Error', statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

// Paginated response
exports.paginatedResponse = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
