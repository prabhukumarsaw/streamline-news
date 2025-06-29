import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

export function generateMFASecret(email: string): { secret: string; qrCode: Promise<string> } {
  const secret = speakeasy.generateSecret({
    name: `News Platform (${email})`,
    issuer: 'News Platform',
    length: 32,
  });

  const qrCode = QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32!,
    qrCode,
  };
}

export function verifyMFA(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allow 1 time step tolerance
  });
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

export function verifyBackupCode(backupCodes: string[], code: string): boolean {
  return backupCodes.includes(code.toUpperCase());
}