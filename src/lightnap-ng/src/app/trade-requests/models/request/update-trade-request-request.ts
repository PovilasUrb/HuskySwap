export interface UpdateTradeRequestRequest {
	// TODO: Update these fields to match the server's UpdateTradeRequestDto.
	requestedClassId: number;
	offeredClassId: number;
	requestingUserId: string;
	targetUserId: string;
	status: string;
	notes: string;
}