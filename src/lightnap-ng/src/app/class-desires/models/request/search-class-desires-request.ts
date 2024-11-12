import { PaginationRequest } from "@core";
export interface SearchClassDesiresRequest extends PaginationRequest {
  classId?: number;
	userId?: string;
	isActive?: boolean;
}
