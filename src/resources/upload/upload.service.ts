import HttpException from '@/utils/exceptions/http.exception'
import logger from '@/utils/shared/customLogger'
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
      logger.error(`[UpdateFileTag]: ${error?.message}`)
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
      logger.error(`[DeleteFile]: ${error?.message}`)
      throw error
    }
  }

  public async deleteTempFiles(): Promise<void> {
    try {
      const result = await cloudinary.api.delete_resources_by_tag('temp')

      logger.info(
        `[CLOUDINARY CLEANUP] Deleted ${
          result.deleted ? Object.keys(result.deleted).length : 0
        } temp files`
      )
    } catch (error) {
      logger.error('[CLOUDINARY CLEANUP] Failed', error)
      throw error
    }
  }
}

export default UploadService
