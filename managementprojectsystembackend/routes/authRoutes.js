const express = require("express");
const { createMeeting } = require("../controllers/meetingController");
const {
  addProject,
  findProject,
  deleteProjectById,
  updateProjectById,
  findProjectById,
  getProjectsByInvite,
} = require("../controllers/projectController");
const {
  addTask,
  findAllTasks,
  deleteTasksById,
  updateTasksById,
  findAllTasksById,
  findAllTasksByProjectId,
  getTasksByInvite,
} = require("../controllers/taskController");
const { login, register } = require("../controllers/authController");
const {
  calendaring,
  addCalendaring,
  updateCalendaring,
  deleteCalendaring,
} = require("../controllers/calenderingController");
const {
  findAccountsById,
  updateAccountsById,
  findAccounts,
  uploadAvatar,
} = require("../controllers/accountController");
const {
  getCommentsByTask,
  addComment,
} = require("../controllers/commentController");
const app = express();
const {
  findAccountsByLeaderRole,
  findAccountsByMemberRole,
  deleteAccountById,
} = require("../controllers/accountController");
// Route đăng nhập
const router = express.Router();
router.post("/login", login);
router.post("/create", createMeeting);
//
router.post("/addTask", addTask);
router.get("/tasks", findAllTasks);
router.get("/taskById/:id", findAllTasksById);
router.get("/taskByIdProject/:projectId", findAllTasksByProjectId);
router.get("/tasksByInvite/:inviteId", getTasksByInvite);

router.delete("/deleteTask/:id", deleteTasksById);
router.put("/updateTask/:id", updateTasksById);
//
router.post("/addProject", addProject);
router.delete("/deleteProject/:id", deleteProjectById);
router.put("/updateProject/:id", updateProjectById);
router.get("/projectsByInvite/:inviteId", getProjectsByInvite);

//
router.get("/calendering/:date", calendaring);
router.post("/addCalendaring", addCalendaring);
router.delete("/deleteCalendaring/:id", deleteCalendaring);
router.put("/updateCalendaring/:id", updateCalendaring);

//
router.get("/projects", findProject);
router.get("/projectsById/:id", findProjectById);
//
router.get("/invitemember", findAccountsByMemberRole);
router.get("/account/:id", findAccountsById);
router.get("/allaccount", findAccounts);
router.put("/upload/:id", uploadAvatar);

//
router.post("/register", register);
router.delete("/deleteAccount/:id", deleteAccountById);
router.put("/account/:id", updateAccountsById);

//
// router.post("/addComment", createComment);
router.get("/comment/:idTask", getCommentsByTask);
router.post("/addComment", addComment);

module.exports = router;
