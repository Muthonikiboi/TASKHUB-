import AppError from '../AppError'; // Adjust the path if needed

describe('AppError', () => {
  it('should create an AppError instance with the correct properties', () => {
    const message = 'Test error message';
    const statusCode = 400;
    const error = new AppError(message, statusCode);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('Fail'); // Since statusCode starts with '4'
    expect(error.isOperational).toBe(true);
  });

  it('should set status to "Error" for non-4xx status codes', () => {
    const message = 'Test error message';
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    expect(error.status).toBe('Error');
  });

  it('should capture the stack trace', () => {
    const message = 'Test error message';
    const statusCode = 404;
    const error = new AppError(message, statusCode);

    expect(error.stack).toBeDefined(); // Check if the stack property is defined
  });
});