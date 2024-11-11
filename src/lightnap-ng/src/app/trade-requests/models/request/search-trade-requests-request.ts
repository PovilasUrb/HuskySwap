
import { PaginationRequest } from "@core";
export interface SearchTradeRequestsRequest extends PaginationRequest {
	// TODO: Update these fields to match the server's SearchTradeRequestDto.
	requestingClassUserId?: number;
	targetClassUserId?: number;
	status?: string;
	notes?: string;
}
