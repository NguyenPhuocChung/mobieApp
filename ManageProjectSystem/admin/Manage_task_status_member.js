import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import styles from "../CSS/ManageTask";
import statusmember from "../CSS/StatusMember";
import { fetchTaskByIdProject } from "../api/apiservice";
const Manage_task_status_member = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // Danh sách dự án
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
  const [refreshing, setRefreshing] = useState(false); // State để quản lý trạng thái refresh
  const [error, setError] = useState(null); // State để lưu lỗi
  const route = useRoute();
  const { data } = route.params;
  console.log("data củaproject", data);

  const time = data.createdAt ? new Date(data.createdAt) : null;
  const timeCreateAt = time ? time.toLocaleDateString() : "";

  const task = async () => {
    const projectId = data._id;
    console.log(projectId);

    setLoading(true);
    setRefreshing(true); // Bắt đầu trạng thái refreshing
    try {
      const task = await fetchTaskByIdProject(projectId); // Gọi hàm fetchProjects
      setTasks(task); // Lưu dữ liệu vào state
      console.log(task); // In ra dữ liệu để debug
    } catch (err) {
      setError(err.message); // Lưu lỗi nếu có
    } finally {
      setLoading(false); // Đánh dấu rằng việc tải dữ liệu đã hoàn tất
      setRefreshing(false); // Kết thúc trạng thái refreshing
    }
  };

  useEffect(() => {
    task(); // Gọi hàm để lấy dữ liệu khi component mount
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.d_flex, styles.margin_vertical]}>
      <Image
        style={[styles.draggable, styles.margin_right]}
        source={require("../img/draggable.png")}
      />
      <View style={[styles.box_task]}>
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
            style={[
              styles.font_size_content,
              statusmember.text_box_status_member,
            ]}
            onPress={() =>
              navigation.navigate("Comment", {
                name: "Comment",
                tasksId: item._id,
              })
            }
          >
            {item.title}
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
            opened this issue on {timeCreateAt}
          </Text>
        </View>
        <Text style={[styles.horizol, styles.margin_vertical]}></Text>
        <Text style={[styles.fontSize_title]}>Status member do task</Text>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        {/* Hiển thị lỗi nếu có */}
        <FlatList
          data={tasks}
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

export default Manage_task_status_member;
