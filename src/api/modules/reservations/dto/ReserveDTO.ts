import Reserve from '../typeorm/entities/Reserve';

class ReserveDTO {
  id: number;
  startDate: string;
  endDate: string;
  finalValue: string;
  userId: number;
  carId: number;

  constructor(reserve: Reserve) {
    this.id = reserve.id;
    this.startDate = reserve.startDate;
    this.endDate = reserve.endDate;
    this.finalValue = reserve.finalValue.toFixed(2).replace('.', ',');
    this.userId = reserve.userId;
    this.carId = reserve.carId;
  }
}

export default ReserveDTO;
