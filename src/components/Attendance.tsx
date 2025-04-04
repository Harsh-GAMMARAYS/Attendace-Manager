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

  // Get unique classes from the data
  const classes = Array.from(
    new Set(attendanceData.map((record) => record.student.class.name))
  );

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching attendance data...');
      
      const response = await fetch('/api/attendance');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch attendance data');
      }

      const data = await response.json();
      console.log('Received attendance data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      setAttendanceData(data);
      
      // Set the first class as default if available
      if (data.length > 0 && !selectedClass) {
        setSelectedClass(data[0].student.class.name);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attendance data';
      setError(errorMessage);
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected class
  const filteredData = attendanceData.filter(
    (record) => record.student.class.name === selectedClass
  );

  // Group records by student
  const groupedByStudent = filteredData.reduce((acc, record) => {
    const studentId = record.studentID;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: record.student,
        records: []
      };
    }
    acc[studentId].records.push(record);
    return acc;
  }, {} as Record<string, { student: AttendanceRecord['student']; records: AttendanceRecord[] }>);

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
        <button 
          onClick={fetchAttendanceData}
          className="mt-4 px-4 py-2 bg-lamaPurple text-white rounded-md hover:bg-lamaPurpleLight transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <div className="p-4 bg-white rounded-md shadow-md">
        <div className="text-center text-gray-500">No attendance records found.</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
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
              <th className="border border-gray-300 px-4 py-2 text-left">Total Records</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Present</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Absent</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Average Attentiveness</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByStudent).map(([studentId, { student, records }]) => {
              const presentCount = records.filter(r => r.status === "PRESENT").length;
              const absentCount = records.filter(r => r.status === "ABSENT").length;
              const totalAttentiveness = records.reduce((sum, r) => sum + (r.attentiveness || 0), 0);
              const averageAttentiveness = records.length > 0 ? Math.round(totalAttentiveness / records.length) : 0;

              return (
                <tr key={studentId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {student.name} {student.surname || ''}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {records.length}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-green-600">
                    {presentCount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-red-600">
                    {absentCount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {averageAttentiveness}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      {filteredData.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold">Total Students</h3>
            <p className="text-2xl">{Object.keys(groupedByStudent).length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold">Total Records</h3>
            <p className="text-2xl">{filteredData.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold">Average Attentiveness</h3>
            <p className="text-2xl">
              {Math.round(filteredData.reduce((sum, r) => sum + (r.attentiveness || 0), 0) / filteredData.length)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
