import React, { ReactNode } from "react";
import AdminTabs from "./_componants/AdminTabs";
interface IProps {
  children: ReactNode;
}
const AdminLayout = ({ children }: IProps) => {
  return (
    <div className="container">
      <AdminTabs />
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;
