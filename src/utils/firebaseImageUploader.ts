import { Request } from "express";
import { bucket } from "./firebase"; 

class FirebaseImageUploader {
  async uploadImage(req: Request): Promise<{ url: string }[] | null> {
    if (!req.files || !Array.isArray(req.files)) {
      console.log('No files to upload:', req.files); 
      throw new Error('No files uploaded.');
    }

    const uploadPromises = req.files.map((file: Express.Multer.File) => {
      return new Promise<{ url: string }>((resolve, reject) => {
        const fileName = `images/${Date.now()}_${file.originalname}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        blobStream.on('error', (err) => {
          console.log('Upload error:', err);
          reject(err);
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
          console.log('Uploaded file available at:', publicUrl);
          resolve({ url: publicUrl });
        });

        blobStream.end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }
}

export default FirebaseImageUploader;
