// Using Data Transfer Objects (DTO)

// import "server-only";
// import connectDB from "@/lib/database";
// import { User } from "@/lib/models/User";
// import { getUser } from "@/lib/dal";
//
// function canSeeUsername(viewer: User) {
//   return true;
// }
//
// export async function getProfileDTO(slug: string) {
//   await connectDB();
//
//   const user = await User.findOne({});
//
//   const currentUser = await getUser(user._id);
//
//   // Or return only what's specific to the query here
//   return {
//     username: canSeeUsername(currentUser) ? user.username : null,
//   };
// }
