import { PaginationRequest } from "@core";
export interface SearchClassInfosRequest extends PaginationRequest {
  title?: string;
	description?: string;
	instructor?: string;
	classCode?: string;
	notes?: string;
}
