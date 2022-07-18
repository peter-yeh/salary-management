import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {API_URL} from 'src/app/env';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }

  getEmployees(minSalary: Number, maxSalary: Number, offset: Number, limit: Number, sort: string)
    : Observable<any> {
    return this.http.get<any>(
        // eslint-disable-next-line max-len
        `${API_URL}/users?minSalary=${minSalary}&maxSalary=${maxSalary}&offset=${offset}&limit=${limit}&sort=${sort}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${API_URL}/deleteAll`);
  }

  uploadCSV(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(
        `${API_URL}/users/upload`,
        formData,
        {headers: headers},
    );
  }
}
