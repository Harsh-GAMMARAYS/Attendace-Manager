import { useState } from "react";

interface AttendanceRecord {
  studentId: string;
  name: string;
  attentiveness: number; // New column for attentiveness
  status: "Present" | "Absent";
}

const Attendance = () => {
  // Dummy classes for the teacher
  const classes = ["Class A", "Class B", "Class C"];

  // State to track the selected class
  const [selectedClass, setSelectedClass] = useState(classes[0]);

  // Dummy attendance data for all classes with hardcoded attentiveness values
  const attendanceData: Record<string, AttendanceRecord[]> = {
    "Class A": [
      { studentId: "123", name: "John Doe", attentiveness: 85, status: "Present" },
      { studentId: "124", name: "Jane Smith", attentiveness: 78, status: "Present" },
      { studentId: "125", name: "Alice Johnson", attentiveness: 45, status: "Absent" },
    ],
    "Class B": [
      { studentId: "223", name: "Michael Brown", attentiveness: 92, status: "Present" },
      { studentId: "224", name: "Emily Davis", attentiveness: 60, status: "Absent" },
      { studentId: "225", name: "Chris Wilson", attentiveness: 88, status: "Present" },
    ],
    "Class C": [
      { studentId: "323", name: "Sarah Lee", attentiveness: 55, status: "Absent" },
      { studentId: "324", name: "David Clark", attentiveness: 95, status: "Present" },
      { studentId: "325", name: "Sophia Martinez", attentiveness: 80, status: "Present" },
    ],
  };

  // Get the data for the selected class
  const data = attendanceData[selectedClass];

  // Extract headers dynamically from the data
  const headers = data.length > 0 ? Object.keys(data[0]) as (keyof AttendanceRecord)[] : [];

  const getStatusClass = (status: string) =>
    status === "Present" ? "text-green-600 font-semibold" : "text-red-600 font-semibold";

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      {/* Class Selection Buttons */}
      <div className="mb-4 flex gap-2">
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
      <h2 className="text-lg font-semibold mb-4">Attendance Details for {selectedClass}</h2>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 px-4 py-2 text-left capitalize"
                >
                  {header.replace(/([A-Z])/g, " $1").trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td
                    key={header}
                    className={`border border-gray-300 px-4 py-2 ${
                      header === "status" ? getStatusClass(item[header]) : ""
                    }`}
                  >
                    {item[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
