import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Employee} from './employee.model';
import {Injectable} from '@angular/core';
import {API_URL} from 'src/app/env';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getEmployees(minSalary: number, maxSalary: number, offset: number, limit: number, sort: string)
    :Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL}/users?minSalary=${minSalary}&maxSalary=
        ${maxSalary}&offset=${offset}&limit=${limit}&sort=${sort}`);
  }
}

