const SidebarItem = ({ icon, text, active, className = '', onClick }) => (
  <div className={`flex items-center py-2 px-3 rounded-md ${active ? 'bg-gray-100 font-medium' : 'text-gray-700'} hover:bg-gray-100 cursor-pointer ${className}`} onClick={onClick}>
    <span className="mr-3 text-gray-500">{icon}</span>
    <span className="text-sm">{text}</span>
  </div>
);

export default SidebarItem;