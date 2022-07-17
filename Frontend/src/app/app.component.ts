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

  minSalary: string = '0';
  maxSalary: string ='99999';
  offset: string = '0';
  limit: string = '30';
  sort_column: string = '+id';

  constructor(private apiService: ApiService, private toast: ToastrService) { }

  ngOnInit() {
    this.updateEmployeeArr();
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }


  changeMinSalary(event: any) {
    if (!(event.target.value as string)) return;
    this.minSalary = event.target.value as string;
  }
  changeMaxSalary(event: any) {
    if (!(event.target.value as string)) return;
    this.maxSalary = event.target.value as string;
  }
  changeOffset(event: any) {
    if (!(event.target.value as string)) return;
    this.offset = event.target.value as string;
  }
  changeLimit(event: any) {
    if (!(event.target.value as string)) return;
    this.limit = event.target.value as string;
  }

  onClick() {
    this.updateEmployeeArr();
  }

  updateEmployeeArr() {
    const minS = Number(this.minSalary);
    const maxS = Number(this.maxSalary);
    const offset = Number(this.offset);
    const limit = Number(this.limit);

    this.employeesSub = this.apiService
        .getEmployees(minS, maxS, offset, limit, '-salary')
        .subscribe((res) => {
          this.employeeArr = res['results'];
          this.dataSource = this.employeeArr;
          this.toast.success('Loaded employee');
        },
        (err) => {
          console.log(err);
          this.toast.error('Error: ', err.error);
        });
  }
}
