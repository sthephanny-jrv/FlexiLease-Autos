import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReservations1727991335165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reservations',
        columns: [
          {
            name: 'id',
            type: 'INTEGER',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'startDate',
            type: 'varchar',
          },
          {
            name: 'endDate',
            type: 'varchar',
          },
          {
            name: 'finalValue',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'userId',
            type: 'INTEGER',
          },
          {
            name: 'carId',
            type: 'INTEGER',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'reservations',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'reservations',
      new TableForeignKey({
        columnNames: ['carId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cars',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('reservations', 'userId');
    await queryRunner.dropForeignKey('reservations', 'carId');
    await queryRunner.dropTable('reservations');
  }
}
