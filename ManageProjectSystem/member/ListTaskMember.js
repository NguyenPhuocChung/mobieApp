import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Thay đổi bộ icon tùy ý
import { fetchTaskByIdInvite } from "../api/inviteService";
import { updateTaskStatus } from "../api/taskService";
import Generate from "../CSS/Generate";
import styles from "../CSS/ManageTask";
import statusmember from "../CSS/StatusMember";

const ListTask = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // Danh sách tác vụ
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [refreshing, setRefreshing] = useState(false); // Trạng thái refreshing
  const [error, setError] = useState(null); // Lưu lỗi
  const [id, setId] = useState(null);
  const [status, setStatus] = useState("Ongoing");

  const handleUpdateStatus = async (id) => {
    console.log("====================================");
    console.log(id, status);
    console.log("====================================");
    try {
      const updatedTask = await updateTaskStatus(id, status);
      if (updatedTask) {
        // Cập nhật giao diện hoặc thông báo thành công cho người dùng
        console.log("Updated task:", updatedTask);
        Alert.alert(
          "Task Updated",
          `The task "${updatedTask.title}" has been updated to status: "${updatedTask.status}".`
        );
      }
    } catch (error) {
      // Xử lý lỗi, có thể thông báo cho người dùng
      console.error("Failed to update task status:", error);
      Alert.alert(
        "Update Failed",
        "There was an error updating the task. Please try again."
      );
    }
  };

  const getID = async () => {
    const data = await AsyncStorage.getItem("userId");
    if (data !== null) {
      setId(data);
    } else {
      console.log("No userId found in AsyncStorage");
    }
  };

  useEffect(() => {
    getID();
  }, []);

  const task = async (inviteId) => {
    // Check if inviteId is provided
    console.log(inviteId);

    if (!inviteId) {
      console.error("Invite ID is null or undefined. Skipping task fetch.");
      setError("Invalid Invite ID.");
      return; // Exit function early if inviteId is missing
    }

    setLoading(true);
    setRefreshing(true); // Start refreshing state

    try {
      const taskData = await fetchTaskByIdInvite(inviteId); // Fetch task data by inviteId
      if (Array.isArray(taskData)) {
        setTasks(taskData); // Set tasks if taskData is an array
      } else {
        console.warn("Unexpected response format:", taskData);
        setTasks([]); // Fallback to empty array if data is not an array
      }
      console.log("Fetched Task Data:", taskData); // Debugging info
    } catch (err) {
      console.error("Error chung fetching tasks:", err.message || err);

      setError(
        err.message || "An unknown error occurred while fetching tasks."
      );
    } finally {
      setLoading(false); // Mark loading as complete
      setRefreshing(false); // End refreshing state
    }
  };

  useEffect(() => {
    if (id) {
      task(id); // Gọi hàm để lấy dữ liệu khi id đã được thiết lập
    }
  }, [id]); // Chạy khi id thay đổi

  const renderItem = ({ item }) => {
    const startDateLocal = item.startDate
      ? new Date(item.startDate).toLocaleDateString()
      : "Unknown Start Date";
    const endDateLocal = item.endDate
      ? new Date(item.endDate).toLocaleDateString()
      : "Unknown End Date";

    return (
      <View style={[styles.d_flex, styles.margin_vertical]}>
        <TouchableOpacity>
          <Image
            style={[statusmember.margin_right]}
            source={require("../img/draggable.png")}
          />
        </TouchableOpacity>
        <View style={[styles.box_task, { position: "relative" }]}>
          <View
            style={[
              Generate.d_flex_align_center,
              { position: "absolute", top: 20, right: 10 },
            ]}
          >
            <Text style={Generate.sizeSubtext}>{startDateLocal}</Text>
            <Icon name="arrow-forward" size={10} color="#000" />
            <Text style={Generate.sizeSubtext}>{endDateLocal}</Text>
          </View>
          <View>
            <Text
              style={[
                styles.font_size_name,
                statusmember.underline,
                statusmember.marginBottom,
              ]}
            >
              {item.createrBy.fullName}
            </Text>
            <Text
              style={[Generate.sizeTitles, statusmember.text_box_status_member]}
              onPress={() =>
                navigation.navigate("Comment", {
                  name: "Comment",
                  tasksId: item._id,
                })
              }
            >
              {item.title}
            </Text>
            <Text style={[Generate.sizeDescription, Generate.marginBottom]}>
              {item.description}
            </Text>
          </View>
          <View
            style={[Generate.d_flex_align_center, Generate.justify_between]}
          >
            <View
              style={[
                styles.box_status,
                styles.d_flex,
                styles.paddingRL,
                item.status === "Not started"
                  ? styles.box_status_notstarted
                  : item.status === "Ongoing"
                  ? styles.box_status_progress
                  : item.status === "Done"
                  ? [styles.box_status_done]
                  : null, // Nếu không thuộc các trạng thái trên, không áp dụng kiểu nào              ]}
              ]}
            >
              <Text style={[styles.point, styles.point_progress]}></Text>
              <Text
                style={[
                  styles.padding_right,
                  item.status === "Not started"
                    ? styles.color_notstarted
                    : item.status === "Ongoing"
                    ? styles.color_ongoing
                    : item.status === "Done"
                    ? [styles.color_done]
                    : null, // Nếu không
                  styles.font_size_content,
                ]}
              >
                {item.status}
              </Text>
            </View>
            {item.status === "Ongoing" || item.status === "Done" ? (
              <Text></Text>
            ) : (
              <TouchableOpacity onPress={() => handleUpdateStatus(item._id)}>
                <Text
                  style={[
                    styles.font_size_content,
                    Generate.box_status_notstarted,
                    Generate.box_status_notstarted,
                    Generate.box,
                  ]}
                >
                  {item.status}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.main]}>
      <View style={[styles.form_create_task]}>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // Trạng thái refreshing
              onRefresh={() => task(id)} // Gọi lại với id hiện tại
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ListTask;
