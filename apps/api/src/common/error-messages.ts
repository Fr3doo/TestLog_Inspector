// Standardized error messages used across the API
// ------------------------------------------------
export const ERR_INVALID_FILETYPE =
  'Invalid file type; only .log or .txt are accepted';

export const ERR_FILE_TOO_LARGE = (limitMb: number) =>
  `File exceeds the ${limitMb}\u00a0MB limit`;

export const ERR_FILE_REQUIRED = 'file is required';
export const ERR_NO_FILES = 'No files uploaded';
