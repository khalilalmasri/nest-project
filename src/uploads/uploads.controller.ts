import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

@Controller('api/uploads')
export class UploadsController {
  //Post: /api/uploads
  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename(req, file, cb) {
          const prefix = `${Date.now() + '-' + Math.round(Math.random() * 1e9)}`;
          const filename = `${prefix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          // || file.mimetype.startsWith('image')
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file type'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded'); // 'No file uploaded';
    console.log('file', file);
    return { message: 'File uploaded successfully' };
  }
  //Get: /api/uploads/:filename
  @Get(':filename')
  public seeUploadedFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return res.sendFile(filename, { root: './images' });
  }
}
