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
          this.employeeArr = res;
          this.toast.success('Loaded shortened link');
        },
        (err) => {
          console.log(err);
          this.toast.error('Error: ', err.error);
        });
  }
}
