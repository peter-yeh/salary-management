import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiService} from 'src/model/api.service';
import {Employee} from 'src/model/employee.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend';

  employeesSub: Subscription = Subscription.EMPTY;
  employeeArr: Employee[] = [];

  displayedColumns: string[] = ['idx', 'id', 'name', 'login', 'salary'];
  dataSource: any;

  minSalary: number = 0;
  maxSalary: number = 99999;
  offset: number = 0;
  limit: number = 30;
  sort_column: string = 'id';
  sort_order: string = '+';


  constructor(private apiService: ApiService, private toast: ToastrService) { }

  ngOnInit() {
    this.updateEmployeeArr();
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }

  changeMinSalary(event: any) {
    if (!Number(event.target.value)) {
      this.toast.error('Min Salary is not a number');
      return;
    }
    this.minSalary = Number(event.target.value);
  }
  changeMaxSalary(event: any) {
    if (!Number(event.target.value)) {
      this.toast.error('Max Salary is not a number');
      return;
    }
    this.maxSalary = Number(event.target.value);
  }
  changeOffset(event: any) {
    if (!Number(event.target.value)) {
      this.toast.error('Offset is not a number');
      return;
    }
    this.offset = Number(event.target.value);
  }
  changeLimit(event: any) {
    if (!Number(event.target.value)) {
      this.toast.error('Limit is not a number');
      return;
    }
    this.limit = Number(event.target.value);
  }

  clickFilter() {
    this.updateEmployeeArr();
  }

  clickNext() {
    this.offset += this.limit;
    this.updateEmployeeArr();
  }

  clickPrev() {
    this.offset -= this.limit;
    if (this.offset < 0) {
      this.offset = 0;
      this.toast.error('No more entries');
      return;
    }
    this.updateEmployeeArr();
  }

  onSelectColumn() {
    const element: any = document.getElementById('sort_column');
    if (!element) return;
    this.sort_column = element.value as string;
  }

  onSelectOrder() {
    const element: any = document.getElementById('sort_order');
    if (!element) return;
    if (element.value === 'ASC') this.sort_order = '+';
    else this.sort_order = '-';
  }


  updateEmployeeArr() {
    const sortAttribute = this.sort_order + this.sort_column;

    this.employeesSub = this.apiService
        .getEmployees(this.minSalary, this.maxSalary, this.offset, this.limit, sortAttribute)
        .subscribe((res) => {
          if (res['results'].length <= 0) {
            this.toast.error('No more entries');
            this.offset -= this.limit;
          } else {
            this.employeeArr = res['results'];
            this.dataSource = this.employeeArr;
            this.toast.success('Loaded employee');
          }
        },
        (err) => {
          console.log(err);
          this.toast.error('Error: ', err.error);
        });
  }
}
