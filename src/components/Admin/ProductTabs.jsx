import { TABS } from '../../constants/admin';

const ProductTabs = ({ activeTab, setActiveTab, resetForm }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        <button
          onClick={() => {
            setActiveTab(TABS.LIST);
            resetForm();
          }}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === TABS.LIST
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Danh sách sản phẩm
        </button>
        <button
          onClick={() => {
            setActiveTab(TABS.ADD);
            resetForm();
          }}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === TABS.EDIT
              ? 'border-yellow-500 text-yellow-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {activeTab === TABS.EDIT ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </button>
      </nav>
    </div>
  );
};

export default ProductTabs; 