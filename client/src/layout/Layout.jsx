import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] ">
      <div className="flex relative">
        {/* Sidebar - conditionally rendered */}
        {showSidebar && <Sidebar />}
        
        {/* Main Content Area */}
        <div className={` z-10
          flex-1 flex flex-col transition-all duration-300
          ml-0
        `}>
          {/* Navbar */}
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Content wrapper with fade-in effect */}
              <div className="animate-fadeIn">
                {children}
              </div>
            </div>
          </main>
          
          {/* Optional Footer - can be added later if needed */}
          <footer className="text-center py-4 text-white/20 milky:text-gray-900/20 text-xs border-t border-white/5 milky:border-gray-900/5">
            <p>© 2024 Frienz. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Layout