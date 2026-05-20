// services/trivia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TriviaCategory {
  id: number;
  name: string;
}

export interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class TriviaService {
  private baseUrl = 'https://opentdb.com/api.php';
  private categoriesUrl = 'https://opentdb.com/api_category.php';

  constructor(private http: HttpClient) {}

  async getCategories(): Promise<TriviaCategory[]> {
    const res: any = await firstValueFrom(this.http.get(this.categoriesUrl));
    return res.trivia_categories;
  }

  async getQuestions(
    categoryId: number,
    difficulty: 'easy' | 'medium' | 'hard',
    amount: number = 10
  ): Promise<TriviaQuestion[]> {
    const url = `${this.baseUrl}?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;
    const res: any = await firstValueFrom(this.http.get(url));
    if (res.response_code !== 0) throw new Error('Failed to fetch trivia questions');
    return res.results;
  }

  // Decode HTML entities that Open Trivia DB encodes in question text
  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}