
import { PaginationRequest } from "@core";
export interface SearchClassUsersRequest extends PaginationRequest {
	// TODO: Update these fields to match the server's SearchClassUserDto.
	classInfoId?: string;
	userId?: string;
	isActive?: boolean;
}
