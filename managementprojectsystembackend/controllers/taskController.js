const Task = require("../models/addTaskModels"); // Import model dự án

// Hàm thêm tác vụ
const addTask = async (req, res) => {
  const {
    title,
    description,
    status,
    invite,
    startDate,
    startTime,
    endDate,
    endTime,
    projectId,
    createrBy,
  } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      invite,
      startDate,
      startTime,
      endDate,
      endTime,
      projectId,
      createrBy,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error); // Cập nhật thông báo lỗi
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Hàm tìm tất cả tác vụ
const findAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("invite", "fullName");
    // Lấy tất cả các tác vụ
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const findAllTasksById = async (req, res) => {
  try {
    const id = req.params.id;
    const tasks = await Task.findById(id);

    // Lấy tất cả các tác vụ
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//
const deleteTasksById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const tasks = await Task.findByIdAndDelete(id);
    // Lấy tất cả các tác vụ
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateTasksById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body; // dữ liệu cập nhật từ yêu cầu
    const updatedTask = await Task.findByIdAndUpdate(
      taskId, // ID của tài liệu cần cập nhật
      updatedData, // Dữ liệu cập nhật
      { new: true } // Trả về tài liệu đã cập nhật thay vì tài liệu cũ
    );
    // Lấy tất cả các tác vụ
    res.status(200).json(updatedTask); // Trả về danh sách tác vụ
    console.log(updatedTask); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//
const findAllTasksByProjectId = async (req, res) => {
  const { projectId } = req.params; // Lấy projectId từ params
  try {
    const tasks = await Task.find({ projectId }).populate("invite", "fullName"); // Chỉnh sửa để tìm theo projectId
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getTasksByInvite = async (req, res) => {
  const inviteId = req.params.inviteId; // Lấy invite ID từ URL params

  try {
    // Tìm tất cả các project có invite chứa inviteId
    const TaskS = await Task.find({ invite: inviteId })
      .populate("createrBy", "fullName")
      .populate("invite", "fullName");

    if (!TaskS || TaskS.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this invite." });
    }

    res.status(200).json(TaskS);
  } catch (error) {
    console.error("Error fetching projects by invite:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch projects." });
  }
};
module.exports = {
  addTask,
  findAllTasks,
  findAllTasksById,
  deleteTasksById,
  updateTasksById,
  findAllTasksByProjectId,
  getTasksByInvite,
}; // Xuất tất cả các hàm
