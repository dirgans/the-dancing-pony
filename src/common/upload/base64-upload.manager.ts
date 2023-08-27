import { BadRequestException } from '@nestjs/common';
import fs, { promises as fsPromise } from 'fs';

export class Base64FileTypeHelper {
  private fileTypes = {
    '/9j': 'JPG',
    iVB: 'PNG',
    Qk0: 'BMP',
    SUk: 'TIFF',
    JVB: 'PDF',
    UEs: 'OFD',
  };

  public getFileType(base64File: string): string {
    try {
      const subString = base64File.substring(0, 3);

      return this.fileTypes[subString];
    } catch (e) {
      console.error('Failed Get File Extension : ' + e.message);

      throw new BadRequestException('Failed get file extension from base64');
    }
  }
}

export class UploadBase64Manager {
  private fullPath: string;

  public thumbnailFileName: string;

  public fileName: string;

  public fullPathThumbnail: string;

  constructor(
    private base64File: string,
    private uploadPath: string,
    private fileNamePrefix: string,
  ) {}

  public setFileName(options?: { extension?: string }): void {
    const name = (
      this.fileNamePrefix.split('/').join('_') + Date.now()
    ).replace(/\s/g, '_');

    this.fileName = `${name}.${options?.extension ?? 'JPG'}`;
  }

  public getFileExtension(): string {
    return new Base64FileTypeHelper().getFileType(this.base64File);
  }

  public async store(): Promise<string> {
    this.checkOrCreateFolder();

    this.setFileName();

    const base64Image = this.base64File.split(';base64,').pop();

    this.fullPath = `${this.uploadPath}/${this.fileName}`;

    await fsPromise
      .writeFile(this.fullPath, base64Image, {
        encoding: 'base64',
      })
      .then(() => {
        console.log('File Created');
      });

    return this.fullPath;
  }

  private checkOrCreateFolder() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath);
    }
  }
}
