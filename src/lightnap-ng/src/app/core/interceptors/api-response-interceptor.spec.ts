import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { apiResponseInterceptor } from "./api-response-interceptor";
import { IdentityService } from "src/app/identity/services/identity.service";
import { RouteAliasService } from "@routing";
import { environment } from "src/environments/environment";
import { HttpErrorApiResponse } from "@core";

describe("apiResponseInterceptor", () => {
  let identityService: jasmine.SpyObj<IdentityService>;
  let routeAliasService: jasmine.SpyObj<RouteAliasService>;
  let next: HttpHandlerFn;

  beforeEach(() => {
    const identityServiceSpy = jasmine.createSpyObj("IdentityService", ["logOut"]);
    const routeAliasServiceSpy = jasmine.createSpyObj("RouteAliasService", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: IdentityService, useValue: identityServiceSpy },
        { provide: RouteAliasService, useValue: routeAliasServiceSpy },
      ],
    });

    identityService = TestBed.inject(IdentityService) as jasmine.SpyObj<IdentityService>;
    routeAliasService = TestBed.inject(RouteAliasService) as jasmine.SpyObj<RouteAliasService>;

    next = jasmine.createSpy().and.returnValue(of(new HttpResponse({ status: 200 })));
  });

  it("should handle 401 error by logging out and navigating to login", done => {
    const request = new HttpRequest("GET", "/test");
    const errorResponse = new HttpErrorResponse({ status: 401 });

    next = jasmine.createSpy().and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      apiResponseInterceptor(request, next).subscribe({
        next: (event: HttpEvent<unknown>) => {
          expect(identityService.logOut).toHaveBeenCalled();
          expect(routeAliasService.navigate).toHaveBeenCalledWith("login");
          done();
        },
      });
    });
  });

  it("should log error in non-production environment", done => {
    const request = new HttpRequest("GET", "/test");
    const errorResponse = new HttpErrorResponse({ status: 500 });

    spyOn(console, "error");
    environment.production = false;

    next = jasmine.createSpy().and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      apiResponseInterceptor(request, next).subscribe({
        next: (event: HttpEvent<unknown>) => {
          expect(console.error).toHaveBeenCalledWith(errorResponse);
          done();
        },
      });
    });
  });

  it("should not log error in production environment", done => {
    const request = new HttpRequest("GET", "/test");
    const errorResponse = new HttpErrorResponse({ status: 500 });

    spyOn(console, "error");
    environment.production = true;

    next = jasmine.createSpy().and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      apiResponseInterceptor(request, next).subscribe({
        next: (event: HttpEvent<unknown>) => {
          expect(console.error).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  it("should return HttpErrorApiResponse on error", done => {
    const request = new HttpRequest("GET", "/test");
    const errorResponse = new HttpErrorResponse({ status: 500 });

    next = jasmine.createSpy().and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      apiResponseInterceptor(request, next).subscribe({
        next: (event: HttpEvent<unknown>) => {
          expect(event).toEqual(jasmine.any(HttpResponse));
          expect((event as HttpResponse<any>).body).toEqual(jasmine.any(HttpErrorApiResponse));
          expect((event as HttpResponse<any>).status).toBe(500);
          done();
        },
      });
    });
  });
});
