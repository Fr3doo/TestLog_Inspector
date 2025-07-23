import { FileValidator } from '../../services/file-validator.service';
import { ERR_INVALID_FILETYPE, ERR_FILE_TOO_LARGE } from '../../common/error-messages';
import type { Express } from 'express';
import type { ConfigService } from '../../common/config.service';

class MockConfigService {
  constructor(public size: number) {}
  get maxUploadSize() {
    return this.size;
  }
}

describe('FileValidator', () => {
  it('should reject files with disallowed extension', () => {
    const config = new MockConfigService(1024); // 1KB limit
    const validator = new FileValidator(config as unknown as ConfigService);
    const file = { originalname: 'evil.png', size: 100 } as Express.Multer.File;

    expect(() => validator.validate(file)).toThrow(ERR_INVALID_FILETYPE);
  });

  it('should reject files exceeding the maximum size', () => {
    const config = new MockConfigService(1024); // 1KB limit
    const validator = new FileValidator(config as unknown as ConfigService);
    const file = { originalname: 'big.log', size: 2048 } as Express.Multer.File;

    expect(() => validator.validate(file)).toThrow(
      ERR_FILE_TOO_LARGE(1)
    );
  });
});
