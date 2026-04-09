-- AddForeignKey
ALTER TABLE "Violation" ADD CONSTRAINT "Violation_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
