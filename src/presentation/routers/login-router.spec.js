const MissingParamError = require('../helpers/missing-param-error');
const LoginRouter = require('./login-router');

const makeSut = () => {
  class AuthUseCase {
    auth() {}
  }
  const authUseCase = new AuthUseCase();
  const { sut } = new LoginRouter(authUseCase);
  return {
    sut,
    authUseCase,
  };
};

describe('Login Router', () => {
  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'fake@email.com',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 500 if no httpRequest or body are provided', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if no body is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should call AuthUseCase with correct params', () => {
    const { sut, authUseCase } = makeSut();
    const httpRequest = {
      body: {
        email: 'fake@email.com',
        password: 'fake_password',
      },
    };
    sut.route(httpRequest);
    expect(authUseCase.email).toBe(httpRequest.body.email);
  });
});
