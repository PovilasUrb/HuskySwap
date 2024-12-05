import { PaginationRequest } from "@core";
export interface SearchClassDesiresRequest extends PaginationRequest {
  classInfoId?: string;
  userId?: string;
  isActive?: boolean;
}
