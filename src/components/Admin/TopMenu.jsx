import { SECTIONS } from '../../constants/admin';

const MenuItem = ({ text, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-md transition-all ${
      active 
        ? 'bg-yellow-500 text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="w-5 h-5 mr-2">{icon}</span>
    <span className="font-medium">{text}</span>
  </button>
);

const TopMenu = ({ activeSection, setActiveSection }) => {
  const BoxIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8 4l-8 4m8-4l-8 4m8 4v-4m-16 4l8-4m-8 4l8 4" />
    </svg>
  );

  const TagIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  const WarehouseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const FileTextIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">MT Fashion Admin</h1>
          </div>

          <nav className="flex space-x-1 ml-10">
            <MenuItem 
              text="Quản lý sản phẩm"
              active={activeSection === SECTIONS.PRODUCTS}
              onClick={() => setActiveSection(SECTIONS.PRODUCTS)}
              icon={<BoxIcon />}
            />
            <MenuItem 
              text="Quản lý mã giảm giá"
              active={activeSection === SECTIONS.DISCOUNTS}
              onClick={() => setActiveSection(SECTIONS.DISCOUNTS)}
              icon={<TagIcon />}
            />
            <MenuItem 
              text="Quản lý kho hàng"
              active={activeSection === SECTIONS.WAREHOUSE}
              onClick={() => setActiveSection(SECTIONS.WAREHOUSE)}
              icon={<WarehouseIcon />}
            />
            <MenuItem 
              text="Quản lý bài viết"
              active={activeSection === SECTIONS.NEWS}
              onClick={() => setActiveSection(SECTIONS.NEWS)}
              icon={<FileTextIcon />}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TopMenu; 