const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

const errorResponse = (message = 'Server Error') => {
  return {
    success: false,
    message
  };
};

const generateSlug = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// --- ADD THIS FUNCTION BELOW ---
const paginate = (totalItems, currentPage, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems: parseInt(totalItems),
    totalPages,
    currentPage: parseInt(currentPage),
    limit: parseInt(limit),
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

module.exports = {
  successResponse,
  errorResponse,
  generateSlug,
  paginate // Make sure to export it!
};