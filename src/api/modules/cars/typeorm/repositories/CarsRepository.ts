import { EntityRepository, Repository } from 'typeorm';
import Car from '../entities/Car';

@EntityRepository(Car)
class CarsRepository extends Repository<Car> {
  public async findById(id: number): Promise<Car | undefined> {
    const car = await this.findOne({
      where: {
        id,
      },
    });

    return car;
  }
}

export default CarsRepository;
