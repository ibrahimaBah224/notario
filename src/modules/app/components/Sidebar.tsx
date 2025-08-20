import { NavLink, useLocation } from 'react-router-dom'
import { useUIStore } from '../../../store/ui.store'
import { navigation } from '../nav'
import { useEffect, useState, useRef } from 'react'

export function Sidebar() {
  const location = useLocation()
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const lastPathRef = useRef<string>('')
  const { 
    sidebarCollapsed: collapsed, 
    toggleSidebar, 
    expandedSections, 
    toggleSection,
    expandSection
  } = useUIStore()

  // Auto-expand section based on current route
  useEffect(() => {
    const currentPath = location.pathname
    
    // Only expand if path actually changed
    if (currentPath !== lastPathRef.current) {
      lastPathRef.current = currentPath
      
      const currentGroup = navigation.find(group => 
        group.items.some(item => item.route === currentPath)
      )
      
      if (currentGroup && !expandedSections.includes(currentGroup.title)) {
        // Use a small delay to ensure navigation completes first
        const timer = setTimeout(() => {
          expandSection(currentGroup.title)
        }, 50)
        
        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, expandedSections, expandSection])

  const handleSectionToggle = (sectionTitle: string) => {
    toggleSection(sectionTitle)
  }

  return (
    <aside className={`sidebar-container flex flex-col gap-4 p-4 transition-all duration-300 ${collapsed ? 'w-20' : 'w-70'} relative`}>
      {/* Profile Section */}
      <div className="sidebar-profile flex items-center gap-3 p-3 rounded-xl">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 shadow-md" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-[var(--text)] truncate">Notario</div>
            <div className="text-xs text-[var(--muted)] truncate">SaaS Notaires</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navigation.map((group, groupIndex) => {
          const isExpanded = expandedSections.includes(group.title)
          const isHovered = hoveredSection === group.title
          
          return (
            <div key={groupIndex} className="space-y-1 relative">
              {/* Section Header */}
              <button
                onClick={() => handleSectionToggle(group.title)}
                onMouseEnter={() => setHoveredSection(group.title)}
                onMouseLeave={() => setHoveredSection(null)}
                className={`sidebar-section-button w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isExpanded 
                    ? 'sidebar-section-button active text-white' 
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? group.title : undefined}
              >
                <div className={`size-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
                {!collapsed && (
                  <>
                    <span className="font-semibold text-xs tracking-wide uppercase flex-1 text-left">
                      {group.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isExpanded ? 'bg-white/20 text-white' : 'bg-[var(--elev)] text-[var(--muted)]'
                    }`}>
                      {group.items.length}
                    </span>
                  </>
                )}
              </button>

              {/* Tooltip for collapsed mode */}
              {collapsed && isHovered && (
                <div className="sidebar-tooltip absolute left-full top-0 ml-3 px-3 py-2 rounded-lg z-50 whitespace-nowrap">
                  <div className="text-sm font-semibold text-[var(--text)]">{group.title}</div>
                  <div className="text-xs text-[var(--muted)]">{group.items.length} éléments</div>
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[var(--surface)] border-l-2 border-b-2 border-[var(--border)] rotate-45"></div>
                </div>
              )}

              {/* Section Items */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className={`space-y-1 ${collapsed ? '' : 'pl-6'}`}>
                  {group.items.map((item, itemIndex) => (
                    <NavLink 
                      key={item.route} 
                      to={item.route} 
                      className={({ isActive }) =>
                        `sidebar-item group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          isActive 
                            ? 'sidebar-item active text-white' 
                            : 'text-[var(--muted)] hover:text-[var(--text)]'
                        } ${collapsed ? 'justify-center' : ''}`
                      }
                      title={collapsed ? item.label : undefined}
                      style={{ 
                        animationDelay: isExpanded ? `${itemIndex * 50}ms` : '0ms',
                        transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
                        opacity: isExpanded ? 1 : 0,
                        transition: 'all 0.3s ease-out'
                      }}
                    >
                      <item.icon className="size-4" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Separator */}
      <div className="sidebar-separator"></div>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="sidebar-section-button p-2.5 rounded-lg transition-all duration-200"
        title={collapsed ? 'Développer' : 'Réduire'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {collapsed ? (
            <path d="M21 15V6a2 2 0 0 0-2-2h-5" />
          ) : (
            <path d="M3 9v9a2 2 0 0 0 2 2h5" />
          )}
        </svg>
      </button>
    </aside>
  )
}


