import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1647178146244 implements MigrationInterface {
  name = 'Init1647178146244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('NEW_REQUEST_CREATED', 'NEW_OFFER_CREATED', 'OFFER_APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "message" text NOT NULL, "type" "public"."notification_type_enum" NOT NULL, "subjectId" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ced25315eb974b73391fb1c81" ON "notification" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_50068e055a8b798c6e308b4880" ON "notification" ("subjectId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_50068e055a8b798c6e308b4880"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ced25315eb974b73391fb1c81"`,
    );
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
  }
}
