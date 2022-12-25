-- CreateTable
CREATE TABLE "CouncilEvent" (
    "order" BIGSERIAL NOT NULL,
    "aggregate_name" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "sequence" BIGINT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CouncilEvent_pkey" PRIMARY KEY ("order")
);

-- CreateIndex
CREATE UNIQUE INDEX "CouncilEvent_stream_id_sequence_key" ON "CouncilEvent"("stream_id", "sequence");
