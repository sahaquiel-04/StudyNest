// ============================================
// services/file.service.ts
// ============================================
import { Injectable } from '@angular/core';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  file?: File;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private maxFileSize = 10 * 1024 * 1024; // 10MB
  private allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor() {}

  /**
   * Open file picker and return selected files
   */
  async pickFiles(multiple: boolean = true): Promise<FileAttachment[]> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple;
      input.accept = this.allowedTypes.join(',');

      input.onchange = async (event: any) => {
        try {
          const files: File[] = Array.from(event.target.files || []);
          const attachments: FileAttachment[] = [];

          for (const file of files) {
            const validation = this.validateFile(file);
            if (validation.valid) {
              const attachment = await this.createAttachment(file);
              attachments.push(attachment);
            } else {
              console.warn(`File ${file.name} rejected:`, validation.error);
            }
          }

          resolve(attachments);
        } catch (error) {
          reject(error);
        }
      };

      input.oncancel = () => {
        resolve([]);
      };

      input.click();
    });
  }

  /**
   * Validate a file
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${this.formatFileSize(this.maxFileSize)}`
      };
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed'
      };
    }

    return { valid: true };
  }

  /**
   * Create attachment object from file
   */
  private async createAttachment(file: File): Promise<FileAttachment> {
    const url = await this.createFileUrl(file);
    
    return {
      id: this.generateId(),
      name: file.name,
      type: this.getFileTypeLabel(file.type),
      size: this.formatFileSize(file.size),
      url: url,
      file: file
    };
  }

  /**
   * Create object URL for file preview
   */
  private createFileUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Format file size to human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get human readable file type label
   */
  private getFileTypeLabel(mimeType: string): string {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
      'text/plain': 'TXT',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'image/webp': 'WEBP',
    };

    return typeMap[mimeType] || 'FILE';
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Download a file
   */
  downloadFile(attachment: FileAttachment) {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  }

  /**
   * Open file in new tab
   */
  openFile(attachment: FileAttachment) {
    window.open(attachment.url, '_blank');
  }

  /**
   * Revoke object URL to free memory
   */
  revokeFileUrl(url: string) {
    URL.revokeObjectURL(url);
  }

  /**
   * Upload files to server (mock implementation)
   * In a real app, this would upload to your backend
   */
  async uploadFiles(attachments: FileAttachment[]): Promise<FileAttachment[]> {
    // TODO: Implement actual file upload to your backend
    // This is a mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate upload and return attachments with server URLs
        const uploadedAttachments = attachments.map(att => ({
          ...att,
          url: `https://your-server.com/files/${att.id}/${att.name}`
        }));
        resolve(uploadedAttachments);
      }, 1000);
    });
  }
}