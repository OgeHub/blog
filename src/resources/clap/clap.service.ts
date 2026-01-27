import HttpException from '@/utils/exceptions/http.exception'
import { addClapProps, Clap } from './clap.interface'
import { ClapModel } from './clap.model'

class ClapService {
  public async addClap(payload: addClapProps): Promise<Clap | null> {
    const clap = await ClapModel.findOneAndUpdate(
      {
        target: payload.target,
        user: payload.user,
        count: { $lt: 50 },
      },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          targetType: payload.targetType,
        },
      },
      {
        new: true,
        upsert: true,
      }
    )

    if (clap) return clap

    // count already at max (50)
    return await ClapModel.findOne({
      target: payload.target,
      user: payload.user,
    })
  }

  public async removeClaps(clapId: string, user: string): Promise<void> {
    const clap = await ClapModel.findById(clapId)
    if (!clap) throw new HttpException(404, 'Clap not found')

    if (clap.user.toString() !== user)
      throw new HttpException(403, 'You can only delete you own clap')

    await ClapModel.findByIdAndDelete(clapId)
  }
}

export default ClapService
