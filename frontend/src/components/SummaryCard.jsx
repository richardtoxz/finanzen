const SummaryCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-lg lg:text-xl font-bold mt-1">{value}</p>
  </div>
);

export default SummaryCard;