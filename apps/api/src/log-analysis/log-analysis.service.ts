import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { LogParser } from "@testlog-inspector/log-parser";
import { ParsedLog } from "@testlog-inspector/log-parser";
import { AnalyzeLogDto } from "./dto/analyze-log.dto";

@Injectable()
export class LogAnalysisService {
  private readonly logger = new Logger(LogAnalysisService.name);

  constructor(private readonly parser: LogParser) {}

  async analyze(dto: AnalyzeLogDto): Promise<ParsedLog> {
    if (!dto.filePath) {
      throw new BadRequestException("filePath is required");
    }

    try {
      return await this.parser.parseFile(dto.filePath);
    } catch (err) {
      this.logger.error("Parsing failed", err as Error);
      throw new BadRequestException((err as Error).message);
    }
  }
}
