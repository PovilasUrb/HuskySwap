import { PaginationRequest } from "@core";
export interface SearchTradeRequestsRequest extends PaginationRequest {
  requestedClassId?: number;
	offeredClassId?: number;
	requestingUserId?: string;
	targetUserId?: string;
	status?: string;
	notes?: string;
}
