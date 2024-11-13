import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassUser } from "./response/class-user";

export interface ClassUserInfo {
	// TODO: Update these fields to match the server's ClassUserDto.
    classUser: ClassUser;
    classInfo: ClassInfo;
}
