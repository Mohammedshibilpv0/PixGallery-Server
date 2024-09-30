import { userType } from "../userType";

export const mapUser = (user: userType) => {
    return {
      _id: user?._id,
      name:user?.name,
      email:user?.email,
      phone:user?.phone

    };
  };
  