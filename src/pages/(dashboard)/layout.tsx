import React, { ReactNode } from 'react';

interface SidebarProps {
    children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    return (
        <div>
            {/* Sidebar content */}
            {children}
        </div>
    );
};

export default Sidebar;