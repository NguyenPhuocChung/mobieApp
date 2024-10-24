import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Thay đổi bộ icon tùy ý
import { fetchTaskByIdInvite } from "../api/apiservice";
import Generate from "../CSS/Generate";
import styles from "../CSS/ManageTask";
import statusmember from "../CSS/StatusMember";

const ListTask = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // Danh sách tác vụ
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [refreshing, setRefreshing] = useState(false); // Trạng thái refreshing
  const [error, setError] = useState(null); // Lưu lỗi
  const [id, setId] = useState(null);

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
    // console.log("Invite", inviteId);
    if (!inviteId) {
      console.log("Invite ID is null. Skipping task fetch.");
      return; // Nếu inviteId là null, không gọi API
    }
    setLoading(true);
    setRefreshing(true); // Bắt đầu trạng thái refreshing
    try {
      const taskData = await fetchTaskByIdInvite(inviteId); // Lấy dữ liệu tác vụ
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
        <TouchableOpacity onPress={() => chooseAction(item)}>
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
