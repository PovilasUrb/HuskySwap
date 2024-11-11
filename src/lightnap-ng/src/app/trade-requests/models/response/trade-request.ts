
export interface TradeRequest {
	// TODO: Update these fields to match the server's TradeRequestDto.
	id: number;
	requestingClassUserId: number;
	targetClassUserId: number;
	status: string;
	notes: string;
}
