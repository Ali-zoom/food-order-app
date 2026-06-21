import EditUserForm from "@/components/profile/EditUserForm";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import { UserRole } from "../generated/prisma/enums";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;
  return (
    <div className="container">
      <EditUserForm user={user!} initialSession={session} />
    </div>
  );
};

export default Profile;
