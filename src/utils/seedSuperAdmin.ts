import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const validateEnv = () => {
  if (!envVars.SUPER_ADMIN_EMAIL || !envVars.SUPER_ADMIN_PASSWORD) {
    throw new Error(
      "Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD in environment variables."
    );
  }
  if (!envVars.BCRYPT_SALT_ROUND) {
    throw new Error("Missing BCRYPT_SALT_ROUND in environment variables.");
  }
};

export const seedSuperAdmin = async () => {
  try {
    validateEnv();

    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("✅ Super Admin already exists.");
      console.log(isSuperAdminExist);
      return;
    }

    console.log("🚀 Creating Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("✅ Super Admin created successfully!\n");
    console.log(superAdmin);
  } catch (error) {
    console.error("❌ Error while seeding Super Admin:", error);
  }
};
