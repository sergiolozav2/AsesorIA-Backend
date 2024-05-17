import { FileRepository } from './file.repository';

export class FileService {
  constructor(fileRP?: FileRepository) {
    this.fileRepository = fileRP ?? new FileRepository();
  }

  fileRepository: FileRepository;

  async storeImageFromURL(url: string) {
    const response = await fetch(url);

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const contentType = response.headers.get('Content-Type');
    const extension = this.getExtensionFromContentType(contentType);
    const fileUrl = await this.fileRepository.storeImage(bytes, extension);
    return fileUrl + extension;
  }

  private getExtensionFromContentType(contentType: string) {
    const map = {
      'image/png': 'png',
      'image/svg+xml': 'svg',
      'image/webp': 'webp',
      'image/jpeg': 'jpeg',
      'application/pdf': 'pdf',
      'audio/mpeg': 'mp3',
    };
    const extension = map[contentType];
    return extension ? `.${extension}` : '';
  }
}
