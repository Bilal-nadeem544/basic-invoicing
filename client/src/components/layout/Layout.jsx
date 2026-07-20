import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex bg-base text-text min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;