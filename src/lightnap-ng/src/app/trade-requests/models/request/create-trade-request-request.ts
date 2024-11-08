export interface CreateTradeRequestRequest {
	// TODO: Update these fields to match the server's CreateTradeRequestDto.
	requestedClassId: number;
	offeredClassId: number;
	requestingUserId: string;
	targetUserId: string;
	status: string;
	notes: string;
}
