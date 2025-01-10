import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import * as multer from 'multer';

@Injectable()
export class FileService {
private readonly uploads = 'C:\\Devs\\RegionsFrance\\Photos_Profils'
  private readonly uploadDir = join(__dirname, this.uploads);

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create upload directory', err);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filePath = join(this.uploadDir, file.filename);
    console.log('filePath service 1', filePath);
    
    await fs.writeFile(filePath, file.buffer);
    return ` ${this.uploads}/${file.filename}`;
  }

  async getFile(path: string): Promise<Buffer> {
    const filePath = path;
    console.log(' filePath Service', filePath);
    
    return fs.readFile(filePath);
  }
}
