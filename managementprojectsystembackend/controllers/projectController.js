const Accounts = require("../models/accountModel");
const Project = require("../models/addProjectModel"); // Import model dự án

const addProject = async (req, res) => {
  const {
    title,
    description,
    startDate,
    startTime,
    endDate,
    endTime,
    invite,
    labels,
    status,
    createrBy,
  } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      invite,
      labels,
      status,
      createrBy,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating task:", error); // Cập nhật thông báo lỗi
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const findProject = async (req, res) => {
  try {
    const allProject = await Project.find()
      .populate("createrBy", "fullName")
      .populate("invite", "fullName"); // Lấy fullName từ Accounts
    res.status(200).json(allProject); // Gửi phản hồi JSON với tất cả dự án
    console.log(JSON.stringify(allProject, null, 2));
  } catch (error) {
    console.error("Error fetching projects:", error); // In lỗi ra console
    res.status(500).json({ message: "Server error" });
  }
};

// Hàm cập nhật dự án bằng ID
const updateProjectById = async (req, res) => {
  const id = req.params.id; // Lấy id từ params
  const updateData = req.body; // Dữ liệu cần cập nhật

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Tùy chọn để trả về tài liệu đã cập nhật và chạy các trình xác thực
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" }); // Nếu không tìm thấy dự án
    }

    res.status(200).json(updatedProject); // Trả về dự án đã cập nhật
  } catch (error) {
    console.error("Error updating project:", error);
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message }); // Trả về lỗi
  }
};

// Hàm xóa dự án bằng ID
const deleteProjectById = async (req, res) => {
  const id = req.params.id; // Lấy id từ params

  try {
    const deletedProject = await Project.findByIdAndDelete(id); // Sử dụng findByIdAndDelete

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" }); // Nếu không tìm thấy dự án
    }

    res.status(200).json({ message: "Project deleted successfully" }); // Thông báo xóa thành công
  } catch (error) {
    console.error("Error deleting project:", error);
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message }); // Trả về lỗi
  }
};

const findProjectById = async (req, res) => {
  const id = req.params.id; // Lấy ID từ params
  try {
    const project = await Project.findById(id)
      .populate("createrBy", "fullName")
      .populate("invite", "fullName"); // Lấy fullName từ Accounts
    console.log(project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" }); // Nếu không tìm thấy dự án
    }

    res.status(200).json(project); // Trả về dự án tìm được
  } catch (error) {
    console.error("Error fetching project:", error); // In lỗi ra console
    res.status(500).json({ message: "Server error" });
  }
};
// Controller lấy project theo ID invite
const getProjectsByInvite = async (req, res) => {
  const inviteId = req.params.inviteId; // Lấy invite ID từ URL params

  try {
    // Tìm tất cả các project có invite chứa inviteId
    const projects = await Project.find({ invite: inviteId })
      .populate("createrBy", "fullName")
      .populate("invite", "fullName");

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this invite." });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by invite:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch projects." });
  }
};
module.exports = {
  addProject,
  findProject,
  updateProjectById,
  deleteProjectById,
  findProjectById,
  getProjectsByInvite,
};
