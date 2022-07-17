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

  minSalary: string = '99999';
  maxSalary: string ='0';
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

  updateEmployeeArr() {
    this.employeesSub = this.apiService
        .getEmployees(0, 23, 31, 23, '-salary')
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
