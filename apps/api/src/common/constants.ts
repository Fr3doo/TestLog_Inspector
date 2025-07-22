// Global constants for the API
// -----------------------------
// Max upload size in bytes (default 50MB), overridable via env var
export const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE
  ? Number(process.env.MAX_UPLOAD_SIZE)
  : 50 * 1024 * 1024;

// Express expects values like '50mb'
export const MAX_UPLOAD_SIZE_LABEL = `${Math.ceil(
  MAX_UPLOAD_SIZE / (1024 * 1024),
)}mb`;
