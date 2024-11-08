export interface TradeRequest {
  // TODO: Update these fields to match the server's TradeRequestDto.
  id: number;
  requestedClassId: number;
	offeredClassId: number;
	requestingUserId: string;
	targetUserId: string;
	status: string;
	notes: string;
}
