import UploadService from '@/resources/upload/upload.service'
import logger from '@/utils/shared/customLogger'
import { Cron } from 'croner'

const uploadService = new UploadService()

const cronJobs = () => {
  new Cron('0 0 * * *', { timezone: 'Africa/Lagos' }, async () => {
    try {
      logger.info('[CRON] Deleting temp files...')
      await uploadService.deleteTempFiles()
      logger.info('[CRON] Temp files deleted successfully')
    } catch (err) {
      logger.error('[CRON] Failed to delete temp files', err)
    }
  })
}

export default cronJobs
