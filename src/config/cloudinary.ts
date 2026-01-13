import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { Request } from 'express'
import {
    folderMap,
    TRANSFORMATIONS,
    UploadType,
} from '@/resources/upload/upload.interface'
import HttpException from '@/utils/exceptions/http.exception'

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// storage config
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request) => {
        const type = req.query.type as UploadType

        if (!type) throw new HttpException(400, 'Upload type is required')

        if (!Object.values(UploadType).includes(type)) {
            throw new HttpException(400, 'Invalid upload type')
        }

        const transformation = TRANSFORMATIONS[type] ?? [
            { fetch_format: 'auto', quality: 'auto' },
        ]

        const userId = req.user?.id

        return {
            folder: folderMap[type],
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
            transformation,
            tags: ['temp', type],
            public_id: `${userId}-${Date.now()}`,
            context: {
                userId,
                type,
            },
        }
    },
})

// file validation
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed'))
    } else {
        cb(null, true)
    }
}

// set multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
})
