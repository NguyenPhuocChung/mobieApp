import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Thay đổi bộ icon tùy ý
import { deleteTaskById, fetchTaskByIdProject } from "../api/apiservice";
import Generate from "../CSS/Generate";
import styles from "../CSS/ManageTask";
import statusmember from "../CSS/StatusMember";

const ListTask = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // Danh sách tác vụ
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [refreshing, setRefreshing] = useState(false); // Trạng thái refreshing
  const [error, setError] = useState(null); // Lưu lỗi
  const route = useRoute();
  const { data } = route.params;
  const isFocused = useIsFocused(); // Kiểm tra trạng thái focus của màn hình
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm

  const time = data.createdAt ? new Date(data.createdAt) : null;
  const timeCreateAt = time ? time.toLocaleDateString() : "";

  const task = async () => {
    const projectId = data._id;
    setLoading(true);
    setRefreshing(true); // Bắt đầu trạng thái refreshing
    try {
      const taskData = await fetchTaskByIdProject(projectId); // Lấy dữ liệu tác vụ
      setTasks(taskData); // Lưu dữ liệu vào state
      console.log("task", taskData); // In ra dữ liệu để debug
    } catch (err) {
      setError(err.message); // Lưu lỗi nếu có
    } finally {
      setLoading(false); // Đánh dấu rằng việc tải dữ liệu đã hoàn tất
      setRefreshing(false); // Kết thúc trạng thái refreshing
    }
  };

  useEffect(() => {
    if (isFocused) {
      task(); // Gọi lại API khi quay về màn hình này
    }
  }, [isFocused]);

  const chooseAction = (item) => {
    Alert.alert(
      "Choose Action",
      "Do you want to edit or delete this project?",
      [
        {
          text: "Edit",
          onPress: () => editProject(item),
        },
        {
          text: "Delete",
          onPress: () => deleteProject(item),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const editProject = async (item) => {
    navigation.navigate("EditTask", {
      name: "EditTask",
      item: item,
    });
  };

  const deleteProject = async (item) => {
    console.log(item._id);
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this project?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const result = await deleteTaskById(item._id); // Gọi API để xóa tác vụ
              console.log("Xóa thành công:", result);
              task(); // Refresh the project list after deletion
            } catch (err) {
              setError(err.message);
              console.error("Error deleting project:", err.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const startDateLocal = item.startDate
      ? new Date(item.startDate).toLocaleDateString()
      : "Unknown Start Date";
    const endDateLocal = item.endDate
      ? new Date(item.endDate).toLocaleDateString()
      : "Unknown End Date";

    return (
      <View style={[styles.d_flex, styles.margin_vertical]}>
        <TouchableOpacity onPress={() => chooseAction(item)}>
          <Image
            style={[statusmember.margin_right]}
            source={require("../img/draggable.png")}
          />
        </TouchableOpacity>
        <View style={[styles.box_task, { position: "relative" }]}>
          {/* Hiển thị startDate và endDate */}
          <View
            style={[
              Generate.d_flex_align_center,
              { position: "absolute", top: 20, right: 10 },
            ]}
          >
            <Text style={Generate.sizeSubtext}>{startDateLocal}</Text>
            <Icon name="arrow-forward" size={10} color="#000" />
            {/* Icon mũi tên */}
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
              {item.invite.fullName}
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
          <View>
            <View
              style={[
                styles.box_status,
                styles.d_flex,
                styles.paddingRL,
                styles.box_status_progress,
              ]}
            >
              <Text style={[styles.point, styles.point_progress]}></Text>
              <Text
                style={[
                  styles.padding_right,
                  styles.color_progress,
                  styles.font_size_content,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.main]}>
      <View style={[styles.form_create_task]}>
        <Text style={[styles.fontSize_title, styles.margin_vertical]}>
          {data.title}
        </Text>
        <View style={[styles.d_flex]}>
          <Text
            style={[
              statusmember.margin_right,
              styles.font_size_name,
              statusmember.underline,
            ]}
          >
            {data.createrBy ? data.createrBy.fullName : "Unknown Creator"}
          </Text>
          <Text style={[styles.font_size_name]}>
            opened this issue on {timeCreateAt}
          </Text>
        </View>
        <Text style={[styles.horizol, styles.margin_vertical]}></Text>
        <Button
          onPress={() =>
            navigation.navigate("CreateTask", {
              name: "CreateTask",
              data: data,
            })
          }
          title="Create task"
          color="#2CAC31"
        />
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            margin: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
          placeholder="Find task..."
          value={searchQuery}
          onChangeText={setSearchQuery} // Cập nhật trạng thái tìm kiếm
        />
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // Trạng thái refreshing
              onRefresh={task} // Hàm gọi lại khi kéo refresh
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ListTask;
