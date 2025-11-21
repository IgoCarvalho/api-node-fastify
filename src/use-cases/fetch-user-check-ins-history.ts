import type { CheckIn } from '@/models/check-in-model';
import type { CheckInsRepository } from '@/repositories/check-ins-repository';

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page?: number;
}

type FetchUserCheckInsHistoryUseCaseResponse = {
  checkIns: CheckIn[];
};

export class FetchUserCheckInsHistoryUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page = 1,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  }
}
