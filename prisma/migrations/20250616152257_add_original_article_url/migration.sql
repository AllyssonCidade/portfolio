-- AlterTable
CREATE SEQUENCE about_id_seq;
ALTER TABLE "About" ALTER COLUMN "id" SET DEFAULT nextval('about_id_seq'),
ALTER COLUMN "paragraph2" DROP NOT NULL;
ALTER SEQUENCE about_id_seq OWNED BY "About"."id";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "originalArticleUrl" TEXT;

-- AlterTable
CREATE SEQUENCE hero_id_seq;
ALTER TABLE "Hero" ALTER COLUMN "id" SET DEFAULT nextval('hero_id_seq');
ALTER SEQUENCE hero_id_seq OWNED BY "Hero"."id";
