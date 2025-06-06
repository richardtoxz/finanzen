const GoalCard = ({ icon, title, progress, value, label }) => (
  <div className="bg-white p-3 lg:p-4 rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
    <div className="flex items-center mb-2">
      <div className="p-2 bg-gray-100 rounded-md mr-2">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
          <div className="h-1 bg-gray-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <p className="font-bold">{value}</p>
      {label && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{label}</span>}
    </div>
  </div>
);

export default GoalCard;