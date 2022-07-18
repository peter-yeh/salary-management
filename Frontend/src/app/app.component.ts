import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApiService} from 'src/model/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend';

  employeesSub: Subscription = Subscription.EMPTY;

  displayedColumns: string[] = ['idx', 'id', 'name', 'login', 'salary'];
  dataSource: any;

  minSalary: number = 0;
  maxSalary: number = 99999;
  offset: number = 0;
  limit: number = 30;
  sort_column: string = 'id';
  sort_order: string = '+';

  fileToUpload: File;

  constructor(private apiService: ApiService, private toast: ToastrService) { }

  ngOnInit() {
    this.fetchEmployees();
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }

  changeMinSalary(event: any) {
    if (!event.target.value) {
      this.minSalary = 0;
      return;
    }
    if (!Number(event.target.value)) {
      this.toast.error('Min Salary is not a number');
      return;
    }
    this.minSalary = Number(event.target.value);
  }
  changeMaxSalary(event: any) {
    if (!event.target.value) {
      this.maxSalary = 0;
      return;
    }
    if (!Number(event.target.value)) {
      this.toast.error('Max Salary is not a number');
      return;
    }
    this.maxSalary = Number(event.target.value);
  }
  changeOffset(event: any) {
    if (!event.target.value) {
      this.offset = 0;
      return;
    }
    if (!Number(event.target.value)) {
      this.toast.error('Offset is not a number');
      return;
    }
    this.offset = Number(event.target.value);
  }
  changeLimit(event: any) {
    if (!event.target.value) {
      this.limit = 0;
      return;
    }
    if (!Number(event.target.value)) {
      this.toast.error('Limit is not a number');
      return;
    }
    this.limit = Number(event.target.value);
  }

  clickFilter() {
    this.offset = 0;
    this.fetchEmployees();
  }

  clickNext() {
    this.offset += this.limit;
    this.fetchEmployees();
  }

  clickPrev() {
    this.offset -= this.limit;
    if (this.offset < 0) {
      this.offset = 0;
      this.fetchEmployees();
      this.toast.error('Reached the end');
      return;
    }
    this.fetchEmployees();
  }

  clickDeleteAll() {
    this.apiService.deleteAll().subscribe(
        (res) => {
          this.toast.success('Deleted all entries from database');
          this.offset= 0;
          this.limit = 30;
          this.dataSource = [];
        },
        (err) =>this.toast.error('Error deleting database'),
    );
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


  fetchEmployees() {
    const sortAttribute = this.sort_order + this.sort_column;

    this.employeesSub = this.apiService
        .getEmployees(this.minSalary, this.maxSalary, this.offset, this.limit, sortAttribute)
        .subscribe((res) => {
          if (res['results'].length <= 0) {
            this.dataSource = [];
            this.toast.error('No entries');
            this.offset = 0;
          } else {
            this.dataSource = res['results'];
          }
        },
        (err) => {
          this.toast.error(err.error);
        });
  }

  handleFileInput(event:any) {
    this.fileToUpload = event.target.files.item(0);
  }

  clickSubmit() {
    if (!this.fileToUpload) return;
    this.apiService.uploadCSV(this.fileToUpload).subscribe(
        (res) => {
          this.toast.success(res);
          // Sometimes, fetchEmployees is called too fast
          // Hence, the list may not be populated
          this.fetchEmployees();
        },
        (err) =>this.toast.error(err.error),
    );
  }
}
