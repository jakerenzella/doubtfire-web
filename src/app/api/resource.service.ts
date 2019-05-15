import { HttpClient } from '@angular/common/http';
import { Resource } from './models/resource';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DoubtfireConstants } from 'src/app/config/constants/doubtfire-constants';

export class ResourceService<T extends Resource> {
  url = this.constants.API_URL;

  constructor(
    protected httpClient: HttpClient,
    protected endpoint: string,
    private constants: DoubtfireConstants) { }

  public create(item: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}`, item)
      .pipe(map((data: T) => data as T));
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(`${this.url}/${this.endpoint}/${item.id}`,
        item)
      .pipe(map((data: T) => data as T));
  }

  public get(id: number): Observable<T> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/${id}`)
      .pipe(map((data: T) => data as T));
  }

  public getAll(): Observable<T[]> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}`)
      .pipe(map((data: any) => this.convertData(data.items)));
  }

  public delete(id: number) {
    return this.httpClient
      .delete(`${this.url}/${this.endpoint}/${id}`);
  }

  private convertData(data: any): T[] {
    return data.map((item: any) => item);
  }
}
