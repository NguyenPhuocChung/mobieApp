import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
} from "react-native";
import styles from "../CSS/ManageTask"; // Chỉnh sửa đường dẫn nếu cần
import { editProjectById, fetchProjectById } from "../api/apiservice"; // API để cập nhật và lấy thông tin dự án

const EditProject = ({ route, navigation }) => {
  const { item } = route.params; // Nhận projectId từ props
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [invite, setInvite] = useState("");
  const [labels, setLabels] = useState("");
  const [status, setStatus] = useState("");
  const id = item._id;

  // Hàm để tải thông tin dự án từ API
  const loadProject = async () => {
    try {
      const data = await fetchProjectById(id);
      setProject(data);
      setTitle(data.title);
      setDescription(data.description);
      setStartDate(data.startDate);
      setStartTime(data.startTime);
      setEndDate(data.endDate);
      setEndTime(data.endTime);
      setInvite(data.invite);
      setLabels(data.labels);
      setStatus(data.status);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    loadProject();
  }, []);

  // Hàm để cập nhật dự án
  const handleUpdate = async () => {
    const updatedProject = {
      title,
      description,
      startDate: new Date(startDate).toISOString(),
      startTime: new Date(startTime).toISOString(),
      endDate: new Date(endDate).toISOString(),
      endTime: new Date(endTime).toISOString(),
      invite,
      labels,
      status,
      createdBy: project?.createdBy, // Nếu có thông tin này trong đối tượng dự án
    };

    try {
      await editProjectById(id, updatedProject);
      Alert.alert("Success", "Project updated successfully!");
      navigation.goBack(); // Quay lại trang trước
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (!project) {
    return <Text>Loading...</Text>; // Hiển thị khi vẫn đang tải dự án
  }

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <StatusBar />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Edit Project</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Start Time (HH:MM)"
        value={startTime}
        onChangeText={setStartTime}
        style={styles.input}
      />
      <TextInput
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
        style={styles.input}
      />
      <TextInput
        placeholder="End Time (HH:MM)"
        value={endTime}
        onChangeText={setEndTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Invite"
        value={invite}
        onChangeText={setInvite}
        style={styles.input}
      />
      <TextInput
        placeholder="Labels"
        value={labels}
        onChangeText={setLabels}
        style={styles.input}
      />
      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        style={styles.input}
      />
      <Button title="Update Project" onPress={handleUpdate} />
    </SafeAreaView>
  );
};

export default EditProject;
