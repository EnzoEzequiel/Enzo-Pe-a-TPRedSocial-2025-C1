import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl = '/api/statistics'; // Asegurate que coincida con tu backend

  constructor(private http: HttpClient) {}

  /**
   * Obtiene estadísticas según el tipo de gráfico/tab y el rango temporal.
   * @param tab (1 = publicaciones por usuario, 2 = total comentarios, 3 = comentarios por post)
   * @param range ('day', 'week', 'month')
   */
  getStatistics(tab: number, range: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?tab=${tab}&range=${range}`);
  }
}
