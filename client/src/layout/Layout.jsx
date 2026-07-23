import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = true, showNavbar = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}

      <div className="flex flex-1 relative">
        {/* Sidebar — fixed, 4.5rem wide collapsed, 14rem expanded on hover */}
        {showSidebar && <Sidebar />}

        {/* Main content — left margin matches collapsed sidebar width so content never gets hidden */}
        <main
          className={`flex-1 flex flex-col min-h-[calc(100vh-4rem)] transition-all duration-300
            ${showSidebar ? "ml-[4.5rem]" : "ml-0"}`}
        >
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto h-full">
              <div className="animate-fadeIn h-full">{children}</div>
            </div>
          </div>

          <footer className="h-10 flex items-center justify-center text-white/20 milky:text-gray-400 text-xs border-t border-white/[0.06] milky:border-gray-200/60">
            © 2025 Frienz. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
