"use client";

import { useState } from "react";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Attendance from "@/components/Attendance";

const TeacherPage = () => {
  const [showAttendance, setShowAttendance] = useState(false);

  const handleAttendanceClick = () => {
    setShowAttendance((prev) => !prev);
  };

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">
            {showAttendance ? "Attendance Details" : "Schedule"}
          </h1>
          {showAttendance ? <Attendance /> : <BigCalendar />}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
        <button
          onClick={handleAttendanceClick}
          className="px-3 py-4 bg-lamaPurple text-white rounded-md hover:text-black hover:bg-lamaPurpleLight transition duration-200"
        >
          {showAttendance ? "Back to Schedule" : "Attendance Details"}
        </button>
      </div>
    </div>
  );
};

export default TeacherPage;
