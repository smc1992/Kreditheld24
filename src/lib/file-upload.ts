import { writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { randomUUID } from 'crypto';

export async function saveFile(file: File, subFolder?: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);

  // Use path.resolve for robust absolute pathing
  const baseUploadDir = resolve(process.cwd(), 'public', 'uploads');
  const targetDir = subFolder ? join(baseUploadDir, subFolder) : baseUploadDir;

  // Ensure directory exists
  await mkdir(targetDir, { recursive: true });

  // Generate unique filename
  const fileExtension = file.name.split('.').pop();
  const uniqueFilename = `${Date.now()}-${randomUUID()}.${fileExtension}`;
  const filepath = join(targetDir, uniqueFilename);

  // Save file
  await writeFile(filepath, buffer);

  // Return public URL
  return subFolder ? `/uploads/${subFolder}/${uniqueFilename}` : `/uploads/${uniqueFilename}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

export function getFileMimeType(filename: string): string {
  const ext = getFileExtension(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}
