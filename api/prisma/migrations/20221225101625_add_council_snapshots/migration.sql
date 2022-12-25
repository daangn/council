-- CreateTable
CREATE TABLE "CouncilSnapshot" (
    "aggregate_name" TEXT NOT NULL,
    "stream_id" TEXT NOT NULL,
    "sequence" BIGINT NOT NULL,
    "state" JSONB NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "CouncilSnapshot_aggregate_name_stream_id_key" ON "CouncilSnapshot"("aggregate_name", "stream_id");
