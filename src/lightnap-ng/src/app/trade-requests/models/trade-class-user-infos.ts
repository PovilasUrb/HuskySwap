import { ClassUserInfo } from "src/app/class-infos/models/class-user-info";

export interface TradeClassUserInfos {
  // TODO: Update these fields to match the server's TradeRequestDto.
  id: number;
  requestingClassUser: ClassUserInfo;
  targetClassUser: ClassUserInfo;
  status: string;
  notes: string;
}
