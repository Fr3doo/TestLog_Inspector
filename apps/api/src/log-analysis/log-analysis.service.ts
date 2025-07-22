import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import type { Express } from "express";
import { LogParser } from "@testlog-inspector/log-parser";
import { ParsedLog } from "@testlog-inspector/log-parser";
import { FileValidator } from "./file-validator.service";

@Injectable()
export class LogAnalysisService {
  private readonly logger = new Logger(LogAnalysisService.name);

  constructor(
    private readonly parser: LogParser,
    private readonly validator: FileValidator,
  ) {}

  async analyze(file: Express.Multer.File): Promise<ParsedLog> {
    if (!file?.path) {
      throw new BadRequestException("file is required");
    }

    this.validator.validate(file);

    try {
      return await this.parser.parseFile(file.path);
    } catch (err) {
      this.logger.error("Parsing failed", err as Error);
      throw new BadRequestException((err as Error).message);
    }
  }
}
