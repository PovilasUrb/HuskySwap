
export interface CreateTradeRequestRequest {
	// TODO: Update these fields to match the server's CreateTradeRequestDto.
	requestingClassUserId: number;
	targetClassUserId: number;
	status: string;
	notes: string;
}
