
import { PaginationRequest } from "@core";
export interface SearchClassInfosRequest extends PaginationRequest {
	// TODO: Update these fields to match the server's SearchClassInfoDto.
	id?: string;
	title?: string;
	description?: string;
	instructor?: string;
	notes?: string;
}
