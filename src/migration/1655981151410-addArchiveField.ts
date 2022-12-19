import { MigrationInterface, QueryRunner } from 'typeorm';

export class addArchiveField1655981151410 implements MigrationInterface {
  name = 'addArchiveField1655981151410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "archive" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "archive"`);
  }
}
