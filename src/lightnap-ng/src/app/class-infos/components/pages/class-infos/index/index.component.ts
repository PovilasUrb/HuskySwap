import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ApiResponseComponent, EmptyPagedResponse, SuccessApiResponse } from "@core";
import { ShowByRolesDirective } from "@identity";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { debounceTime, startWith, Subject, switchMap } from "rxjs";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { InputTextModule } from "primeng/inputtext";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [
    CommonModule,
    CardModule,
    ApiResponseComponent,
    TableModule,
    RouterModule,
    ButtonModule,
    ShowByRolesDirective,
    InputTextModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
})
export class IndexComponent {
  pageSize = 10;

  #classInfoService = inject(ClassInfoService);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    title: this.#fb.control(""),
  });

  #lazyLoadEventSubject = new Subject<TableLazyLoadEvent>();
  searchResults$ = this.#lazyLoadEventSubject.pipe(
    switchMap(event =>
      this.#classInfoService.searchClassInfos({
        title: this.form.value.title,
        pageSize: this.pageSize,
        pageNumber: event.first / this.pageSize + 1,
      })
    ),
    // We need to bootstrap the p-table with a response to get the whole process running. We do it this way to
    // fake an empty response so we can avoid a redundant call to the API.
    startWith(new SuccessApiResponse(new EmptyPagedResponse<ClassInfo>()))
  );

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(), debounceTime(500)).subscribe(() => {
      this.onLazyLoad({ first: 0, rows: this.pageSize });
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.#lazyLoadEventSubject.next(event);
  }
}
