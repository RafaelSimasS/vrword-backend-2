export const LLM_USAGE_REPOSITORY = 'LLM_USAGE_REPOSITORY';

export interface ILlmUsageRepository {
  getDailyCount(userId: string, date: string): Promise<number>;
  increment(userId: string, date: string): Promise<void>;
}
