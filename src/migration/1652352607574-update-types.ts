import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTypes1652352607574 implements MigrationInterface {
  name = 'updateTypes1652352607574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('UNKNOWN_NOTIFICATION_TYPE', 'NEW_REQUEST_CREATED', 'NEW_OFFER_CREATED', 'NEW_MESSAGE', 'DEAL_IN_PROGRESS', 'DEAL_PAID', 'DEAL_CANCELED', 'DEAL_COMPLETED', 'DEAL_CUSTOMER_PAID', 'DEAL_DISPUTE', 'OFFER_CANCELED', 'OFFER_CONFIRMED', 'OFFER_IN_PROGRESS', 'OFFER_IS_HOLD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum_old" AS ENUM('NEW_REQUEST_CREATED', 'NEW_OFFER_CREATED', 'OFFER_APPROVED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`,
    );
  }
}
