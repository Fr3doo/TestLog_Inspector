import { IsString } from "class-validator";

export class AnalyzeLogDto {
  @IsString()
  filePath!: string;
}
