const TransactionCard = ({ icon, category, value, date }) => (
  <div className="bg-white p-3 lg:p-4 rounded border border-gray-200 flex items-center cursor-pointer hover:shadow-md transition-shadow">
    <div className="mr-3 text-gray-500 ">{icon}</div>
    <div className="flex-1" >
      <p className="font-medium">{category}</p>
      <p className="text-sm text-gray-500">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{date}</p>
    </div>
  </div>
);

export default TransactionCard;