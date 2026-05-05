import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type LlmCard = {
  deckId: string | null;
  front: string;
  back: string;
};

export type DetectedObject = {
  labelEn: string;
  labelPt: string;
  score: number;
};

export type DetectionResult = {
  objects: DetectedObject[];
};

@Injectable()
export class LlmServerClient {
  private readonly logger = new Logger(LlmServerClient.name);
  private readonly baseUrl: string;
  private readonly internalKey: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = (
      this.config.get<string>('LLM_SERVER_URL') ?? 'http://localhost:8000'
    ).replace(/\/+$/, '');
    this.internalKey = this.config.get<string>('INTERNAL_API_KEY') ?? '';
  }

  private get _headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Internal-Key': this.internalKey,
    };
  }

  private async _handleError(
    response: Response,
    context: string,
  ): Promise<never> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = await response.json().catch(() => ({}));
    this.logger.warn(
      '%s returned %d: %s',
      context,
      response.status,
      err?.detail ?? 'unknown error',
    );
    throw new Error(err?.detail ?? `${context} failed`);
  }

  async generateCards(
    word: string,
    deckId: string | undefined,
    userId: string,
  ): Promise<LlmCard[]> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: { ...this._headers, 'X-User-Id': userId },
      body: JSON.stringify({ word, deckId: deckId ?? null }),
    });

    if (!response.ok) {
      return this._handleError(response, 'LLM /generate');
    }

    return response.json() as Promise<LlmCard[]>;
  }

  async detectObjects(
    imageBase64: string,
    userId: string,
  ): Promise<DetectionResult> {
    const response = await fetch(`${this.baseUrl}/detect`, {
      method: 'POST',
      headers: { ...this._headers, 'X-User-Id': userId },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      return this._handleError(response, 'LLM /detect');
    }

    return response.json() as Promise<DetectionResult>;
  }
}
