-- CreateTable
CREATE TABLE "CouncilSnapshot" (
    "aggregate_name" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "sequence" BIGINT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CouncilSnapshot_stream_id_sequence_key" ON "CouncilSnapshot"("stream_id", "sequence");
