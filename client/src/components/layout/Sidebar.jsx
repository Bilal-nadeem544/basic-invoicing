import { NavLink } from "react-router-dom";
import { FileText, PlusCircle, LayoutGrid, FileBarChart, Settings as SettingsIcon } from "lucide-react";
import { useBrand } from "../../context/BrandContext";

const navItems = [
  { to: "/", label: "Invoices", icon: FileText, end: true },
  { to: "/invoices/new", label: "New invoice", icon: PlusCircle },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function Sidebar() {
  const { brandName, brandLogo } = useBrand();

  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        {brandLogo ? (
          <img src={brandLogo} alt="Logo" className="w-7 h-7 rounded-md object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <LayoutGrid size={16} className="text-white" />
          </div>
        )}
        <span className="font-display font-semibold text-[15px] truncate">{brandName}</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-text hover:bg-cardHover"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;