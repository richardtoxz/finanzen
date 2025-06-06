const OptionButton = ({ id, label, icon, selected, onToggle }) => (
  <button onClick={() => onToggle(id)} className={`p-4 text-left border-2 rounded-lg transition-all hover:shadow-md ${selected ? 'border-gray-400 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}>
    <div className="flex items-start space-x-3">
      {icon && <span className="text-2xl">{icon}</span>}
      <div className="flex-1">
        <div className={`w-4 h-4 border-2 float-right mt-1 transition-all ${selected ? 'border-gray-500 bg-gray-500' : 'border-gray-300'}`}>
          {selected && <div className="w-full h-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
        </div>
        <p className="text-sm font-medium text-gray-800 pr-6">{label}</p>
      </div>
    </div>
  </button>
);

export default OptionButton;