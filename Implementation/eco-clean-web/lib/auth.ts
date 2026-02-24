import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
export async function verifyUser(email: string, password: string) {
  return {
    id: "dev-user",
    name: "Developer",
    email,
    role: "ADMIN",
  };
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
// export async function verifyUser(email: string, password: string) {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) return null;

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return null;

//   return {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   };
// }
