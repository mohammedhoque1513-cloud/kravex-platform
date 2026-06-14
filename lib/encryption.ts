import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const PREFIX = "enc:v1";

function encryptionKey() {
  const value = process.env.TOTP_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("TOTP_ENCRYPTION_KEY must be configured in production.");
    }
    return null;
  }
  return createHash("sha256").update(value).digest();
}

export function encryptSecret(secret: string) {
  const key = encryptionKey();
  if (!key) return secret;

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [PREFIX, iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(":");
}

export function decryptSecret(value: string) {
  if (!value.startsWith(`${PREFIX}:`)) return value;

  const key = encryptionKey();
  if (!key) throw new Error("The 2FA encryption key is unavailable.");

  const [, , ivValue, tagValue, encryptedValue] = value.split(":");
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("The encrypted 2FA secret is invalid.");

  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
