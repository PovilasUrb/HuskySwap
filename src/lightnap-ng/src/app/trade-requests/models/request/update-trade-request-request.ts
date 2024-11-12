
export interface UpdateTradeRequestRequest {
	// TODO: Update these fields to match the server's UpdateTradeRequestDto.
	requestingClassUserId: number;
	targetClassUserId: number;
	status: string;
	notes: string;
}