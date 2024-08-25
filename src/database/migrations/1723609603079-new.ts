import { MigrationInterface, QueryRunner } from 'typeorm';

export class New1723609603079 implements MigrationInterface {
  name = 'New1723609603079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "text"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "text" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "category" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP COLUMN "correctAnswer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "correctAnswer" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "upadtedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "upadtedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "questionId"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "questionId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP COLUMN "selectedAnswer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "selectedAnswer" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" DROP COLUMN "submittedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" ADD "submittedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_936f02bd820ff3892ab44a76617" FOREIGN KEY ("quizSubmissionId") REFERENCES "quiz_submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_611bef6102c491c49be42432c17" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_questions_question" ADD CONSTRAINT "FK_4a78420f711459e3208a886ba7a" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_questions_question" ADD CONSTRAINT "FK_51ec21f848eef540a431cb2cd3c" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_questions_question" DROP CONSTRAINT "FK_51ec21f848eef540a431cb2cd3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_questions_question" DROP CONSTRAINT "FK_4a78420f711459e3208a886ba7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_611bef6102c491c49be42432c17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_936f02bd820ff3892ab44a76617"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" DROP COLUMN "submittedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submission" ADD "submittedAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "createdAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP COLUMN "selectedAnswer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "selectedAnswer" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "questionId"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "questionId" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "upadtedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "upadtedAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "email" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "updatedAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "createdAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "title" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "updatedAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "createdAt" 'timestamp without time zone' NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP COLUMN "correctAnswer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "correctAnswer" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "category" 'character varying' NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "text"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "text" 'character varying' NOT NULL`,
    );
  }
}
