import type { Express, Request, Response } from 'express';
import {
  createFileValidationMiddleware,
  composeValidators,
} from './file-validation.middleware';

describe('createFileValidationMiddleware', () => {
  it('should call validator for each file', () => {
    const files = [
      { path: '/tmp/a.log', originalname: 'a.log', size: 1 },
      { path: '/tmp/b.log', originalname: 'b.log', size: 1 },
    ] as Express.Multer.File[];
    const req = { files } as unknown as Request;
    const next = jest.fn();
    const validate = jest.fn();

    const mw = createFileValidationMiddleware(validate);
    mw(req, {} as Response, next);

    expect(validate).toHaveBeenCalledTimes(2);
    expect(validate).toHaveBeenNthCalledWith(1, files[0]);
    expect(validate).toHaveBeenNthCalledWith(2, files[1]);
    expect(next).toHaveBeenCalledWith();
  });

  it('should propagate validator errors', () => {
    const files = [
      { path: '/tmp/a.log', originalname: 'a.log', size: 1 },
    ] as Express.Multer.File[];
    const req = { files } as unknown as Request;
    const error = new Error('boom');
    const validate = jest.fn(() => {
      throw error;
    });
    const next = jest.fn();

    const mw = createFileValidationMiddleware(validate);
    mw(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should noop when no files are present', () => {
    const req = { files: [] } as unknown as Request;
    const next = jest.fn();
    const validate = jest.fn();

    const mw = createFileValidationMiddleware(validate);
    mw(req, {} as Response, next);

    expect(validate).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });
});

describe('composeValidators', () => {
  it('should execute all validators in order', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const composite = composeValidators(fn1, fn2);
    const file = {
      path: '/tmp/a.log',
      originalname: 'a.log',
      size: 1,
    } as Express.Multer.File;

    composite(file);

    expect(fn1).toHaveBeenCalledWith(file);
    expect(fn2).toHaveBeenCalledWith(file);
  });
});
