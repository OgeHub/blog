import HttpException from '@/utils/exceptions/http.exception'
import { v2 as cloudinary } from 'cloudinary'

class UploadService {
    public async updateFileTag(publicId: string, tag: string): Promise<void> {
        try {
            const removeResult = await cloudinary.uploader.remove_tag('temp', [
                publicId,
            ])
            if (removeResult?.public_ids?.length === 0)
                throw new HttpException(400, 'Invalid avatar publicId')

            const addResult = await cloudinary.uploader.add_tag(tag, [publicId])
            if (addResult?.public_ids?.length === 0)
                throw new HttpException(400, 'Invalid avatar publicId')
        } catch (error: any) {
            console.error(`[UpdateFileTag]: ${error?.message}`)
            throw error
        }
    }

    public async deleteFile(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                invalidate: true,
            })
            if (result?.result === 'not found')
                throw new HttpException(400, 'Invalid publicId')
        } catch (error: any) {
            console.error(`[DeleteFile]: ${error?.message}`)
            throw error
        }
    }
}

export default UploadService
