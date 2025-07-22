// Global constants for the API
// -----------------------------
import { getConfig } from './config';

// Max upload size in bytes (default 50MB)
export const MAX_UPLOAD_SIZE = getConfig().maxUploadSize;

// Express body-parser expects bytes when using a numeric limit

