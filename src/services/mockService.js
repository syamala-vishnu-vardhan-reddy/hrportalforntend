import mockUsers from "../mockData/users";
import employees from "../mockData/employees";
import { leaves, leaveTypes, leaveBalances } from "../mockData/leaves";
import attendance from "../mockData/attendance";
import { performanceReviews, performanceGoals } from "../mockData/performance";

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service
const mockService = {
  // Auth services
  auth: {
    login: async (credentials) => {
      await delay(500);
      const user = mockUsers.find(
        (user) =>
          user.email === credentials.email &&
          user.password === credentials.password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const { password, ...userWithoutPassword } = user;
      const token = `mock-token-${user.id}-${Date.now()}`;

      return {
        data: {
          user: userWithoutPassword,
          token,
        },
      };
    },

    register: async (userData) => {
      await delay(500);
      const existingUser = mockUsers.find(
        (user) => user.email === userData.email
      );

      if (existingUser) {
        throw new Error("Email already in use");
      }

      const newUser = {
        id: mockUsers.length + 1,
        username: userData.username || userData.email.split("@")[0],
        email: userData.email,
        password: userData.password,
        role: "employee",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        department: userData.department || "",
        position: userData.position || "",
        phone: userData.phone || "",
        hire_date: new Date().toISOString().split("T")[0],
        profile_image: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 100)}.jpg`,
      };

      const { password, ...userWithoutPassword } = newUser;
      const token = `mock-token-${newUser.id}-${Date.now()}`;

      return {
        data: {
          user: userWithoutPassword,
          token,
        },
      };
    },

    getProfile: async () => {
      await delay(300);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const userId = parseInt(token.split("-")[2]);
      const user = mockUsers.find((user) => user.id === userId);

      if (!user) {
        throw new Error("User not found");
      }

      const { password, ...userWithoutPassword } = user;

      return {
        data: userWithoutPassword,
      };
    },

    updateProfile: async (userData) => {
      await delay(500);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const userId = parseInt(token.split("-")[2]);
      const userIndex = mockUsers.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // In a real app, this would update the database
      const updatedUser = {
        ...mockUsers[userIndex],
        ...userData,
      };

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        data: userWithoutPassword,
      };
    },

    logout: async () => {
      await delay(300);
      return { data: { success: true } };
    },
  },

  // Employee services
  employees: {
    getAll: async () => {
      await delay(500);
      return { data: employees };
    },

    getById: async (id) => {
      await delay(300);
      const employee = employees.find((emp) => emp.id === parseInt(id));

      if (!employee) {
        throw new Error("Employee not found");
      }

      return { data: employee };
    },

    create: async (employeeData) => {
      await delay(700);
      const newEmployee = {
        id: employees.length + 1,
        ...employeeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return { data: newEmployee };
    },

    update: async (id, employeeData) => {
      await delay(500);
      const employeeIndex = employees.findIndex(
        (emp) => emp.id === parseInt(id)
      );

      if (employeeIndex === -1) {
        throw new Error("Employee not found");
      }

      const updatedEmployee = {
        ...employees[employeeIndex],
        ...employeeData,
        updated_at: new Date().toISOString(),
      };

      return { data: updatedEmployee };
    },

    delete: async (id) => {
      await delay(500);
      return { data: { success: true } };
    },

    getStats: async () => {
      await delay(400);

      // Calculate department distribution
      const departments = {};
      employees.forEach((emp) => {
        if (!departments[emp.department]) {
          departments[emp.department] = 0;
        }
        departments[emp.department]++;
      });

      // Calculate status distribution
      const statuses = {};
      employees.forEach((emp) => {
        if (!statuses[emp.status]) {
          statuses[emp.status] = 0;
        }
        statuses[emp.status]++;
      });

      // Calculate recent hires (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentHires = employees.filter(
        (emp) => new Date(emp.hire_date) >= thirtyDaysAgo
      ).length;

      return {
        data: {
          totalEmployees: employees.length,
          byDepartment: Object.entries(departments).map(
            ([department, count]) => ({ department, count })
          ),
          byStatus: Object.entries(statuses).map(([status, count]) => ({
            status,
            count,
          })),
          recentHires,
        },
      };
    },
  },

  // Leave services
  leaves: {
    getAll: async () => {
      await delay(500);
      return { data: leaves };
    },

    getById: async (id) => {
      await delay(300);
      const leave = leaves.find((l) => l.id === parseInt(id));

      if (!leave) {
        throw new Error("Leave request not found");
      }

      return { data: leave };
    },

    create: async (leaveData) => {
      await delay(700);
      const newLeave = {
        id: leaves.length + 1,
        ...leaveData,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      return { data: newLeave };
    },

    update: async (id, leaveData) => {
      await delay(500);
      const leaveIndex = leaves.findIndex((l) => l.id === parseInt(id));

      if (leaveIndex === -1) {
        throw new Error("Leave request not found");
      }

      const updatedLeave = {
        ...leaves[leaveIndex],
        ...leaveData,
      };

      return { data: updatedLeave };
    },

    delete: async (id) => {
      await delay(500);
      return { data: { success: true } };
    },

    getLeaveTypes: async () => {
      await delay(300);
      return { data: leaveTypes };
    },

    getLeaveBalance: async (employeeId) => {
      await delay(400);
      const balance = leaveBalances.filter(
        (lb) => lb.employee_id === parseInt(employeeId)
      );
      return { data: balance };
    },
  },

  // Attendance services
  attendance: {
    getAll: async (filters = {}) => {
      await delay(500);
      let filteredAttendance = [...attendance];

      if (filters.employee_id) {
        filteredAttendance = filteredAttendance.filter(
          (a) => a.employee_id === parseInt(filters.employee_id)
        );
      }

      if (filters.date) {
        filteredAttendance = filteredAttendance.filter(
          (a) => a.date === filters.date
        );
      }

      if (filters.status) {
        filteredAttendance = filteredAttendance.filter(
          (a) => a.status === filters.status
        );
      }

      return { data: filteredAttendance };
    },

    getById: async (id) => {
      await delay(300);
      const record = attendance.find((a) => a.id === parseInt(id));

      if (!record) {
        throw new Error("Attendance record not found");
      }

      return { data: record };
    },

    create: async (attendanceData) => {
      await delay(600);
      const newAttendance = {
        id: attendance.length + 1,
        ...attendanceData,
        created_at: new Date().toISOString(),
      };

      return { data: newAttendance };
    },

    update: async (id, attendanceData) => {
      await delay(500);
      const recordIndex = attendance.findIndex((a) => a.id === parseInt(id));

      if (recordIndex === -1) {
        throw new Error("Attendance record not found");
      }

      const updatedRecord = {
        ...attendance[recordIndex],
        ...attendanceData,
      };

      return { data: updatedRecord };
    },

    checkIn: async (employeeId, checkInData) => {
      await delay(400);
      const date = checkInData.date || new Date().toISOString().split("T")[0];

      // Check if record already exists
      const existingRecord = attendance.find(
        (a) => a.employee_id === parseInt(employeeId) && a.date === date
      );

      if (existingRecord) {
        const updatedRecord = {
          ...existingRecord,
          check_in: new Date().toISOString(),
          status: "present",
        };

        return { data: updatedRecord };
      }

      // Create new record
      const newRecord = {
        id: attendance.length + 1,
        employee_id: parseInt(employeeId),
        employee_name:
          employees.find((e) => e.id === parseInt(employeeId))?.first_name +
          " " +
          employees.find((e) => e.id === parseInt(employeeId))?.last_name,
        date,
        check_in: new Date().toISOString(),
        check_out: null,
        status: "present",
        work_hours: null,
        overtime: null,
        notes: checkInData.notes || "",
      };

      return { data: newRecord };
    },

    checkOut: async (employeeId, checkOutData) => {
      await delay(400);
      const date = checkOutData.date || new Date().toISOString().split("T")[0];

      // Find existing record
      const existingRecord = attendance.find(
        (a) => a.employee_id === parseInt(employeeId) && a.date === date
      );

      if (!existingRecord) {
        throw new Error("No check-in record found for today");
      }

      const checkInTime = new Date(existingRecord.check_in);
      const checkOutTime = new Date();
      const diffMs = checkOutTime - checkInTime;
      const workHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
      const overtime = workHours > 8 ? workHours - 8 : 0;

      const updatedRecord = {
        ...existingRecord,
        check_out: checkOutTime.toISOString(),
        work_hours: workHours,
        overtime,
        notes: checkOutData.notes || existingRecord.notes,
      };

      return { data: updatedRecord };
    },
  },

  // Performance services
  performance: {
    getAll: async () => {
      await delay(500);
      return { data: performanceReviews };
    },

    getById: async (id) => {
      await delay(300);
      const review = performanceReviews.find((r) => r.id === parseInt(id));

      if (!review) {
        throw new Error("Performance review not found");
      }

      return { data: review };
    },

    create: async (reviewData) => {
      await delay(700);
      const newReview = {
        id: performanceReviews.length + 1,
        ...reviewData,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return { data: newReview };
    },

    update: async (id, reviewData) => {
      await delay(500);
      const reviewIndex = performanceReviews.findIndex(
        (r) => r.id === parseInt(id)
      );

      if (reviewIndex === -1) {
        throw new Error("Performance review not found");
      }

      const updatedReview = {
        ...performanceReviews[reviewIndex],
        ...reviewData,
        updated_at: new Date().toISOString(),
      };

      return { data: updatedReview };
    },

    delete: async (id) => {
      await delay(500);
      return { data: { success: true } };
    },

    getGoals: async (reviewId) => {
      await delay(400);
      const goals = performanceGoals.filter(
        (g) => g.review_id === parseInt(reviewId)
      );
      return { data: goals };
    },

    addGoal: async (reviewId, goalData) => {
      await delay(600);
      const newGoal = {
        id: performanceGoals.length + 1,
        review_id: parseInt(reviewId),
        ...goalData,
        created_at: new Date().toISOString(),
      };

      return { data: newGoal };
    },

    updateGoal: async (goalId, goalData) => {
      await delay(500);
      const goalIndex = performanceGoals.findIndex(
        (g) => g.id === parseInt(goalId)
      );

      if (goalIndex === -1) {
        throw new Error("Performance goal not found");
      }

      const updatedGoal = {
        ...performanceGoals[goalIndex],
        ...goalData,
      };

      return { data: updatedGoal };
    },
  },
};

export default mockService;
