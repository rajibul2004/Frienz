import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


const Layout = ({ children, showSidebar = true,showNavbar=true }) => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-1 flex-col relative">
        {showNavbar && <Navbar/> }
        {/* Sidebar - conditionally rendered */}
        <div className="flex ">
          {showSidebar && (
            <div className="fixed top-0 left-0 h-screen w-64 z-20">
              <Sidebar />
            </div>
          )}
          <div
            className={` z-10
          flex-1 flex flex-col transition-all duration-300
          ${showSidebar && "ml-20"} 
          min-h-[calc(100vh-4rem)]
        `}
          >
            <main className="flex-1 p-4 sm:p-6 lg:p-8 h-full">
              <div className="max-w-7xl mx-auto h-full">
                <div className="animate-fadeIn h-full">{children}</div>
              </div>
            </main>

            {/* Optional Footer - can be added later if needed */}
            <footer className="h-10 flex items-center justify-center text-white/20 milky:text-gray-900/20 text-xs border-t border-white/5 milky:border-gray-900/5">
              <p>© 2024 Frienz. All rights reserved.</p>
            </footer>
          </div>
        </div>

        {/* Main Content Area */}
      </div>
    </div>
  );
};

export default Layout;
