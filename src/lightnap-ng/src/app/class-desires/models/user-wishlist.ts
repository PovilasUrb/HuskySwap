import { ClassUserInfo } from "src/app/class-users/models/class-user-info";

export interface UserWishlist {
	// TODO: Update these fields to match the server's ClassUserDto.
    classUserInfos: Array<ClassUserInfo>;
    userId: string;
}
