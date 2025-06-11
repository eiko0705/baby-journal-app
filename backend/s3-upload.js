import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            const filename = path.basename(file.originalname, extension) + '-' + Date.now() + extension;
            cb(null, filename);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
});

export default upload;