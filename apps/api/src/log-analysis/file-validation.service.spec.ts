import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import type { Express } from 'express';
import { FileValidationService } from './file-validation.service';
import { FileValidator } from './file-validator.service';
import { ERR_FILE_REQUIRED, ERR_INVALID_FILETYPE } from '../common/error-messages';

class MockFileValidator {
  validate = jest.fn();
}

describe('FileValidationService', () => {
  let service: FileValidationService;
  let validator: MockFileValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileValidationService,
        { provide: FileValidator, useClass: MockFileValidator },
      ],
    }).compile();

    service = module.get<FileValidationService>(FileValidationService);
    validator = module.get<FileValidator>(FileValidator) as unknown as MockFileValidator;
  });

  it('should delegate validation to FileValidator', () => {
    const file = { path: '/tmp/foo.log', originalname: 'foo.log', size: 1 } as Express.Multer.File;

    service.validate(file);

    expect(validator.validate).toHaveBeenCalledWith(file);
  });

  it('should throw when file has no path', () => {
    expect(() => service.validate({} as Express.Multer.File)).toThrow(ERR_FILE_REQUIRED);
    expect(validator.validate).not.toHaveBeenCalled();
  });

  it('should propagate errors from FileValidator', () => {
    const file = { path: '/tmp/foo.log', originalname: 'foo.log', size: 1 } as Express.Multer.File;
    validator.validate.mockImplementation(() => {
      throw new BadRequestException(ERR_INVALID_FILETYPE);
    });

    expect(() => service.validate(file)).toThrow(ERR_INVALID_FILETYPE);
  });
});
