import { useState, useEffect } from "react";

interface AttendanceRecord {
  id: number;
  studentID: string;
  status: "PRESENT" | "ABSENT";
  attentiveness: number | null;
  student: {
    name: string;
    surname: string | null;
    class: {
      name: string;
    };
  };
  attendance: {
    uploadedAt: Date;
  };
}

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Get unique classes from the data
  const classes = Array.from(
    new Set(attendanceData.map((record) => record.student.class.name))
  );

  useEffect(() => {
    fetchAttendanceData();
  }, [dateRange]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      queryParams.append('startDate', dateRange.startDate);
      queryParams.append('endDate', dateRange.endDate);

      const response = await fetch(`/api/attendance?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      setAttendanceData(data);
      // Set the first class as default if available
      if (data.length > 0 && !selectedClass) {
        setSelectedClass(data[0].student.class.name);
      }
    } catch (err) {
      setError("Failed to fetch attendance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected class
  const filteredData = attendanceData.filter(
    (record) => record.student.class.name === selectedClass
  );

  const getStatusClass = (status: string) =>
    status === "PRESENT" ? "text-green-600 font-semibold" : "text-red-600 font-semibold";

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-md shadow-md">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lamaPurple"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-md shadow-md">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      {/* Date Range Selection */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Class Selection Buttons */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {classes.map((className) => (
          <button
            key={className}
            onClick={() => setSelectedClass(className)}
            className={`px-4 py-2 rounded-md ${
              selectedClass === className
                ? "bg-lamaPurple text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } transition duration-200`}
          >
            {className}
          </button>
        ))}
      </div>

      {/* Selected Class Title */}
      <h2 className="text-lg font-semibold mb-4">
        Attendance Details for {selectedClass}
      </h2>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Attentiveness</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {record.student.name} {record.student.surname || ''}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.student.class.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(record.attendance.uploadedAt).toLocaleDateString()}
                </td>
                <td className={`border border-gray-300 px-4 py-2 ${getStatusClass(record.status)}`}>
                  {record.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.attentiveness ? `${record.attentiveness}%` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      {filteredData.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold">Total Students</h3>
            <p className="text-2xl">{filteredData.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold">Present</h3>
            <p className="text-2xl text-green-600">
              {filteredData.filter((record) => record.status === "PRESENT").length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold">Absent</h3>
            <p className="text-2xl text-red-600">
              {filteredData.filter((record) => record.status === "ABSENT").length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
