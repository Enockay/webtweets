import React from 'react';
import { FaHome, FaProjectDiagram, FaCog, FaShoppingCart,FaFolderPlus } from 'react-icons/fa';

interface SidebarProps {
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
  return (
    <div>
      {/* Large Screen Sidebar */}
      <div className="hidden lg:block w-64  bg-gray-800 p-8 fixed left-0 top-0 h-screen">
        <h5 className=" font-bold text-white">Dashboard</h5>
        <nav className="mt-8">
          <ul>
            <li className="mb-6">
              <button onClick={() => onSectionChange('home')} className="flex items-center text-white w-full">
                <FaHome className="mr-2" /> Home
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => onSectionChange('create project')} className="flex items-center text-white w-full">
                <FaFolderPlus className="mr-2" /> create project
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => onSectionChange('projects')} className="flex items-center text-white w-full">
                <FaProjectDiagram className="mr-2" /> Projects
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => onSectionChange('settings')} className="flex items-center text-white w-full">
                <FaCog className="mr-2" /> Settings
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => onSectionChange('badges')} className="flex items-center text-white w-full">
                <FaShoppingCart className="mr-2" /> Purchase Badges
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Small Screen Sidebar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-2 flex justify-around">
        <button onClick={() => onSectionChange('home')} className="text-white">
          <FaHome size={24} />
        </button>
        <button onClick={() => onSectionChange('projects')} className="text-white">
          <FaProjectDiagram size={24} />
        </button>
        <button onClick={() => onSectionChange('settings')} className="text-white">
          <FaCog size={24} />
        </button>
        <button onClick={() => onSectionChange('badges')} className="text-white">
          <FaShoppingCart size={24} />
        </button>
        <button onClick={() => onSectionChange('create project')} className="text-white">
          <FaFolderPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
