import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { editTaskById, fetchTaskById } from "../api/apiservice"; // API service for fetching and updating task details

const EditTask = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params; // Get task ID from route params
  const taskId = item._id;
  // State variables for task details
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task details when the component is mounted
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskDetails = await fetchTaskById(taskId);
        console.log("task detail for " + taskDetails);

        setTaskTitle(taskDetails.title);
        setTaskDescription(taskDetails.description);
        setStartDate(taskDetails.startDate);
        setEndDate(taskDetails.endDate);
        setStatus(taskDetails.status);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Function to handle task update
  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        title: taskTitle,
        description: taskDescription,
        startDate,
        endDate,
        status,
      };
      await editTaskById(taskId, updatedTask); // Update task details through API
      Alert.alert("Success", "Task updated successfully!");
      navigation.goBack(); // Navigate back after updating
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", "Failed to update task.");
    }
  };

  // Form for editing the task details
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Enter task title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={taskDescription}
              onChangeText={setTaskDescription}
              placeholder="Enter task description"
              multiline
            />

            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Status</Text>
            <TextInput
              style={styles.input}
              value={status}
              onChangeText={setStatus}
              placeholder="Enter task status"
            />

            <Button title="Update Task" onPress={handleUpdateTask} />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  scrollView: {
    flexGrow: 1,
  },
});
export default EditTask;
