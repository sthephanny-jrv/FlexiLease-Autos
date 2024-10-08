import { EntityRepository, Repository } from 'typeorm';
import Reserve from '../entities/Reserve';

@EntityRepository(Reserve)
class ReserveRepository extends Repository<Reserve> {
  public async findById(id: number): Promise<Reserve | undefined> {
    const reserve = await this.findOne({
      where: {
        id,
      },
    });

    return reserve;
  }

  public async findReservationsByUserId(userId: number): Promise<Reserve[]> {
    const reservations = await this.find({
      where: {
        userId,
      },
    });

    return reservations;
  }

  public async findByUserIdReserveId(
    userId: number,
    id: number,
  ): Promise<Reserve | undefined> {
    const reserve = await this.findOne({
      where: {
        userId,
        id,
      },
    });

    return reserve;
  }
}

export default ReserveRepository;
