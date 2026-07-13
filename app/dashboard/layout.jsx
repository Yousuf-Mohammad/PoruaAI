import React from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-64 md:block">
        <SideBar />
      </aside>
      <div className="md:ml-64">
        <Header />
        <main className="px-8 py-10">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
