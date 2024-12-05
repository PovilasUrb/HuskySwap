import { ClassUserInfo } from "src/app/class-infos/models/class-user-info";

export interface UserClasses {
	// TODO: Update these fields to match the server's ClassUserDto.
    classUserInfos: Array<ClassUserInfo>;
    userId: string;
}
