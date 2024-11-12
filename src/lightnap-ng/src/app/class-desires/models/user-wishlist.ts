import { ClassInfo } from "src/app/class-infos/models/response/class-info";

export interface UserWishlist {
	// TODO: Update these fields to match the server's ClassUserDto.
    classInfos: Array<ClassInfo>;
    userId: string;
}
