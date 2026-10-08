import crypto from 'crypto';
import path from 'path';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { STORAGE_BUCKET_NAME, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../config/constants';

/**
 * Validates binary magic bytes for allowed image formats:
 * - JPEG: FF D8 FF
 * - PNG: 89 50 4E 47 0D 0A 1A 0A
 * - WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
 */
export function validateMagicBytes(buffer: Buffer): { isValid: boolean; detectedMime?: string } {
  if (buffer.length < 12) {
    return { isValid: false };
  }

  // Check JPEG (FF D8 FF)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, detectedMime: 'image/jpeg' };
  }

  // Check PNG (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, detectedMime: 'image/png' };
  }

  // Check WebP (RIFF .... WEBP)
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  if (isRiff && isWebp) {
    return { isValid: true, detectedMime: 'image/webp' };
  }

  return { isValid: false };
}

/**
 * Generates an unguessable, sanitized storage filename
 */
export function generateSafeStoragePath(originalFilename: string, mimeType: string): string {
  const extensionMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  const ext = extensionMap[mimeType] || path.extname(originalFilename).toLowerCase() || '.jpg';
  const randomHex = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `inspections/${timestamp}-${randomHex}${ext}`;
}

/**
 * Uploads an image buffer to Supabase Storage and generates a secure signed URL
 */
export async function uploadImageAndGetSignedUrl(
  buffer: Buffer,
  storagePath: string,
  mimeType: string
): Promise<{ storagePath: string; signedUrl: string }> {
  try {
    // Attempt upload to Supabase Storage bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.warn('[Storage Service] Supabase upload failed, using data URI fallback:', uploadError.message);
      // Fallback for resilient offline/local preview
      const base64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return {
        storagePath,
        signedUrl: base64Url,
      };
    }

    // Generate signed URL (expires in 24 hours / 86400 seconds)
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET_NAME)
      .createSignedUrl(storagePath, 86400);

    if (signedError || !signedData?.signedUrl) {
      console.warn('[Storage Service] Failed to create signed URL:', signedError?.message);
      const base64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return {
        storagePath,
        signedUrl: base64Url,
      };
    }

    return {
      storagePath,
      signedUrl: signedData.signedUrl,
    };
  } catch (err: any) {
    console.error('[Storage Service] Unexpected storage exception:', err);
    const base64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;
    return {
      storagePath,
      signedUrl: base64Url,
    };
  }
}
