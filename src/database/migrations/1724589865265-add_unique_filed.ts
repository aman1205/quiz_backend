import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueFiled1724589865265 implements MigrationInterface {
    name = 'AddUniqueFiled1724589865265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" DROP CONSTRAINT "FK_51ec21f848eef540a431cb2cd3c"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" DROP CONSTRAINT "FK_4a78420f711459e3208a886ba7a"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_936f02bd820ff3892ab44a76617"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_611bef6102c491c49be42432c17"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_936f02bd820ff3892ab44a76617" FOREIGN KEY ("quizSubmissionId") REFERENCES "quiz_submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_611bef6102c491c49be42432c17" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" ADD CONSTRAINT "FK_4a78420f711459e3208a886ba7a" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" ADD CONSTRAINT "FK_51ec21f848eef540a431cb2cd3c" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" DROP CONSTRAINT "FK_51ec21f848eef540a431cb2cd3c"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" DROP CONSTRAINT "FK_4a78420f711459e3208a886ba7a"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_611bef6102c491c49be42432c17"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" DROP CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_936f02bd820ff3892ab44a76617"`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_611bef6102c491c49be42432c17" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_936f02bd820ff3892ab44a76617" FOREIGN KEY ("quizSubmissionId") REFERENCES "quiz_submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" ADD CONSTRAINT "FK_4a78420f711459e3208a886ba7a" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_submission" ADD CONSTRAINT "FK_d80e4bff3be137d3f97a5ac42d7" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_questions_question" ADD CONSTRAINT "FK_51ec21f848eef540a431cb2cd3c" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
