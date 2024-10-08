import Car from '../typeorm/entities/Car';

interface Accessory {
  name: string;
}

class CarDTO {
  id: number;
  model: string;
  color: string;
  year: number;
  valuePerDay: number;
  acessories: Accessory[];
  numberOfPassengers: number;

  constructor(car: Car) {
    this.id = car.id;
    this.model = car.model;
    this.color = car.color;
    this.year = car.year;
    this.valuePerDay = car.valuePerDay;
    this.acessories = car.acessories.map(name => ({ name }));
    this.numberOfPassengers = car.numberOfPassengers;
  }
}

export default CarDTO;
