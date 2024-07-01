import React from 'react';
import { FaHome, FaProjectDiagram, FaCog, FaShoppingCart, FaFolderPlus } from 'react-icons/fa';
import { useDashboard ,Section} from './DashContext';

const Sidebar: React.FC = () => {
  const { setCurrentSection } = useDashboard();

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
  };

  return (
    <div>
      {/* Large Screen Sidebar */}
      <div className="hidden lg:block w-64 bg-gray-800 p-8 fixed left-0 top-0 h-screen">
        <div className='h-10'>
          <h5 className='m-0 text-lime-500 text-center italic'>webtweets</h5>
        </div>
        <hr></hr>
        <nav className="mt-8">
          <ul>
            <li className="mb-6">
              <button onClick={() => handleSectionChange('home')} className="flex items-center text-white w-full">
                <FaHome className="mr-2" /> Home
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => handleSectionChange('create project')} className="flex items-center text-white w-full">
                <FaFolderPlus className="mr-2" /> Create Project
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => handleSectionChange('projects')} className="flex items-center text-white w-full">
                <FaProjectDiagram className="mr-2" /> Projects
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => handleSectionChange('settings')} className="flex items-center text-white w-full">
                <FaCog className="mr-2" /> Settings
              </button>
            </li>
            <li className="mb-6">
              <button onClick={() => handleSectionChange('badges')} className="flex items-center text-white w-full">
                <FaShoppingCart className="mr-2" /> Purchase Badges
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Small Screen Sidebar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-2 flex justify-around">
        <button onClick={() => handleSectionChange('home')} className="text-white">
          <FaHome size={24} />
        </button>
        <button onClick={() => handleSectionChange('projects')} className="text-white">
          <FaProjectDiagram size={24} />
        </button>
        <button onClick={() => handleSectionChange('settings')} className="text-white">
          <FaCog size={24} />
        </button>
        <button onClick={() => handleSectionChange('badges')} className="text-white">
          <FaShoppingCart size={24} />
        </button>
        <button onClick={() => handleSectionChange('create project')} className="text-white">
          <FaFolderPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
