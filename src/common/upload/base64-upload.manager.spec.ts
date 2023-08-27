import { BadRequestException } from '@nestjs/common';
import {
  UploadBase64Manager,
  Base64FileTypeHelper,
} from './base64-upload.manager'; // Adjust the import path
import fs from 'fs';
import fsPromise from 'fs/promises';

// Mock fs.mkdirSync
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  mkdirSync: jest.fn(),
}));

// Mock fsPromise.writeFile
jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  writeFile: jest.fn(),
}));

describe('UploadBase64Manager', () => {
  const base64FileMock = 'mockedBase64Data';
  const uploadPathMock = '/mocked/upload/path';
  const fileNamePrefixMock = 'test_prefix';
  const optionsMock = { extension: 'PNG' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of UploadBase64Manager', () => {
    const uploadManager = new UploadBase64Manager(
      base64FileMock,
      uploadPathMock,
      fileNamePrefixMock,
    );

    expect(uploadManager).toBeInstanceOf(UploadBase64Manager);
  });

  it('should set the file name', () => {
    const uploadManager = new UploadBase64Manager(
      base64FileMock,
      uploadPathMock,
      fileNamePrefixMock,
    );

    uploadManager.setFileName(optionsMock);

    expect(uploadManager.fileName).toMatch(/test_prefix_\d+\.PNG/);
  });

  it('should get the file extension', () => {
    const uploadManager = new UploadBase64Manager(
      base64FileMock,
      uploadPathMock,
      fileNamePrefixMock,
    );

    const extension = uploadManager.getFileExtension();

    expect(extension).toBe('PNG');
  });

  it('should store the file', async () => {
    const uploadManager = new UploadBase64Manager(
      base64FileMock,
      uploadPathMock,
      fileNamePrefixMock,
    );

    await uploadManager.store();

    expect(fs.mkdirSync).toHaveBeenCalledWith(uploadPathMock);
    expect(fsPromise.writeFile).toHaveBeenCalledWith(
      `${uploadPathMock}/${uploadManager.fileName}`,
      'mockedBase64Data',
      {
        encoding: 'base64',
      },
    );
  });
});
