import { Module } from '@nestjs/common';
import { VerificationService } from 'src/services/verification.service';

@Module({
    providers: [VerificationService],
    exports: [VerificationService]
})
export class VerificationModule {}
