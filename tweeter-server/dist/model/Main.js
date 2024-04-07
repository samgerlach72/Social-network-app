"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Main {
    test1Follow() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("test");
            // const followsDAO = new FollowsDAO();
            // // Put 25 items into the "follows" table with the same follower
            // for (let i = 1; i <= 35; i++) {
            //     const follow = new Follow(
            //         "@allen",
            //         `@Followee${i}`
            //     );
            //     await followsDAO.putFollow(follow);
            // }
            // // Put 25 more items into the "follows" table with the same followee
            // for (let i = 1; i <= 25; i++) {
            //     const follow = new Follow(
            //         `@Follower${i}`,
            //         "@allen",
            //     );
            //     await followsDAO.putFollow(follow);
            // }
            // const getFollow = await followsDAO.getFollow("@allen", "@Followee1");
            // console.log("Get Follow:", getFollow);
            // // // Update the "follower_name" and "followee_name" attributes of one of the items
            // // await followsDAO.updateFollowName("@Follower1", "@ClintEastwood", "New Follower Name", "New Followee Name");
            // // Delete one of the items from the "follows" table using its primary key
            // await followsDAO.deleteFollow("@allen", "@Followee1");
        });
    }
}
function run() {
    new Main().test1Follow();
    // new Main().test2Follow();
}
run();
