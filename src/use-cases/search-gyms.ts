import type { Gym } from '@/models/gym-model';
import type { GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsUseCaseRequest {
  query: string;
  page?: number;
}

type SearchGymsUseCaseResponse = {
  gyms: Gym[];
};

export class SearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page = 1,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
