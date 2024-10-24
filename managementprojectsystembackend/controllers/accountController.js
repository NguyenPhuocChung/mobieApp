const Account = require("../models/accountModel"); // Đảm bảo đường dẫn đúng
const Project = require("../models/addProjectModel"); //
const multer = require("multer");
const path = require("path"); // Thêm dòng này
// Hàm tìm tài khoản có role là 'member'
const findAccounts = async (req, res) => {
  try {
    const members = await Account.find().populate("workHistory", "title");
    res.status(200).json(members); // Trả về danh sách tài khoản member
    console.log(members);
  } catch (error) {
    res.status(500).json({ message: "Error finding member", error });
    console.error("Error finding members:", error);
  }
};

const findAccountsByMemberRole = async (req, res) => {
  try {
    const members = await Account.find({ role: "memeber" }).populate(
      "workHistory",
      "title"
    );
    res.status(200).json(members); // Trả về danh sách tài khoản member
    console.log(members);
  } catch (error) {
    res.status(500).json({ message: "Error finding member", error });
    console.error("Error finding members:", error);
  }
};

// Hàm tìm tài khoản có role là 'leader'
const findAccountsByLeaderRole = async (req, res) => {
  try {
    const leaders = await Account.find({ role: "leader" }).populate(
      "workHistory",
      "title"
    );
    res.status(200).json(leaders); // Trả về danh sách tài khoản leader
    console.log(JSON.stringify(leaders, null, 2));
  } catch (error) {
    console.error("Error finding leaders:", error);
    res.status(500).json({ message: "Error finding leaders", error });
  }
};

const findAccountsById = async (req, res) => {
  try {
    const id = req.params.id; // Lấy id từ params
    console.log(id);

    const account = await Account.findById(id).populate("workHistory", "title"); // Sử dụng findById

    if (!account) {
      return res.status(404).json({ message: "Account not found" }); // Nếu không tìm thấy tài khoản
    }

    console.log(JSON.stringify(account, null, 2));
    return res.status(200).json(account); // Trả về tài khoản đã tìm thấy
  } catch (error) {
    console.error("Error finding account:", error);
    return res.status(500).json({ message: "Error finding account", error }); // Trả về lỗi
  }
};

const updateAccountsById = async (req, res) => {
  try {
    const id = req.params.id; // Lấy id từ params
    const updateData = req.body; // Lấy dữ liệu cần cập nhật từ request body

    console.log(id);

    const account = await Account.findOneAndUpdate(
      { _id: id }, // Điều kiện tìm kiếm
      updateData, // Dữ liệu cần cập nhật
      { new: true } // Tùy chọn này để trả về tài liệu đã cập nhật
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" }); // Nếu không tìm thấy tài khoản
    }

    console.log(JSON.stringify(account, null, 2));
    return res
      .status(200)
      .json({ message: "Account updated successfully", account }); // Thông báo cập nhật thành công
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ message: "Error updating account", error }); // Trả về lỗi
  }
};

// Hàm xóa tài khoản bằng ID
const deleteAccountById = async (req, res) => {
  try {
    const id = req.params.id; // Lấy id từ params
    console.log(id);

    const account = await Account.findByIdAndDelete(id); // Sử dụng findByIdAndDelete

    if (!account) {
      return res.status(404).json({ message: "Account not found" }); // Nếu không tìm thấy tài khoản
    }

    console.log(`Account with id ${id} deleted successfully`);
    return res.status(200).json({ message: "Account deleted successfully" }); // Thông báo xóa thành công
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ message: "Error deleting account", error }); // Trả về lỗi
  }
};
//
const uploadAvatar = async (req, res) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  const upload = multer({ storage }).single("avatar"); // Đảm bảo tên trường khớp với tên trong FormData
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    try {
      const account = await Account.findById(req.params.id);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Cập nhật avatar
      const profileImage = req.file ? req.file.path : null;
      console.log(profileImage);
      await Account.findByIdAndUpdate(
        req.params.id, // Điều kiện tìm kiếm
        { avatar: profileImage }, // Dữ liệu cập nhật
        { new: true } // Trả về document đã cập nhật
      );

      // Trả về avatarPath và người dùng đã cập nhật
      res.json({
        avatarPath: account.avatar,
        user: { ...account._doc, avatar: account.avatar },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

// Xuất các hàm để sử dụng ở nơi khác
module.exports = {
  findAccountsByMemberRole,
  findAccountsByLeaderRole,
  findAccountsById,
  updateAccountsById,
  deleteAccountById, // Thêm vào đây
  findAccounts,
  uploadAvatar,
};
