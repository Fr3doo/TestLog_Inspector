import type { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';

export type FileValidatorFn = (file: Express.Multer.File) => void;

export const composeValidators = (
  ...validators: FileValidatorFn[]
): FileValidatorFn => {
  return (file: Express.Multer.File) => {
    for (const validate of validators) validate(file);
  };
};

export function createFileValidationMiddleware(validate: FileValidatorFn) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || !files.length) {
      return next();
    }
    try {
      for (const file of files) validate(file);
      return next();
    } catch (err) {
      return next(err as Error);
    }
  };
}
