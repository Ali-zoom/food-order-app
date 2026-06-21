import { getServerSession } from "next-auth";
import React from "react";
import { UserRole } from "../generated/prisma/enums";
import { redirect } from "next/navigation";
import EditUserForm from "@/components/profile/EditUserForm";
import { authOptions } from "@/lib/authOptions";

const Admin = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;
  return (
    <div className="container">
      <EditUserForm user={user!} initialSession={session} />
    </div>
  );
};

export default Admin;
