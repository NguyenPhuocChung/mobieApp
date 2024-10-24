import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Modal,
  TextInput,
  Title,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Generate from "../CSS/Generate";
import { fetchAccount, updateAccount } from "../api/apiservice";

const AccountDetail = () => {
  const [image, setImage] = useState(null);
  const [id, setId] = useState("");
  const [account, setAccount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAccount, setUpdatedAccount] = useState({
    fullName: null,
    birthDate: null,
    address: null,
    phone: null,
    email: null,
    position: null,
    role: null,
    department: null,
    startDate: null,
    salary: null,
    avatar: null,
    workHistory: [],
  });

  const loadData = async () => {
    try {
      const idUser = await AsyncStorage.getItem("userId");
      if (idUser) setId(idUser);
    } catch (error) {
      console.log("Error fetching data from AsyncStorage", error);
    }
  };

  const fetchData = async () => {
    console.log(id);
    if (id) {
      try {
        const accountData = await fetchAccount(id);
        setAccount(accountData);
        setUpdatedAccount({
          fullName: accountData.fullName || null,
          birthDate: accountData.birthDate || null,
          address: accountData.address || null,
          phone: accountData.phone || null,
          email: accountData.email || null,
          position: accountData.position || null,
          role: accountData.role || null,
          department: accountData.department || null,
          startDate: accountData.startDate || null,
          salary: accountData.salary || null,
          avatar: accountData.avatar,
          workHistory: accountData.workHistory || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleUpdateAccount = async () => {
    try {
      await updateAccount(id, updatedAccount);
      const accountData = await fetchAccount(id);
      setAccount(accountData);
      setUpdatedAccount(accountData);
      setVisible(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedImageUri = pickerResult.assets[0].uri;
      setImage(selectedImageUri);

      const formData = new FormData();
      formData.append("avatar", {
        uri: selectedImageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      try {
        await axios.put(
          `http://192.168.1.3:5000/api/auth/upload/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Upload thành công!");
      } catch (err) {
        alert("Upload thất bại.");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.avatarContainer}>
              {account?.avatar && (
                <Image
                  source={{ uri: `http://192.168.1.3:5000/${account.avatar}` }}
                  style={styles.avatar}
                />
              )}
              <TouchableOpacity onPress={handleImageUpload}>
                <Text style={styles.uploadButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
            <View>
              {renderDetail("Full Name", account.fullName, "person")}
              {renderDetail("Birth Date", account.birthDate || "N/A", "event")}
              {renderDetail("Address", account.address || "N/A", "location-on")}
              {renderDetail("Phone", account.phone || "N/A", "phone")}
              {renderDetail("Email", account.email, "email")}
              {renderDetail("Position", account.position || "N/A", "work")}
              {renderDetail("Role", account.role, "supervisor-account")}
              {renderDetail(
                "Department",
                account.department || "N/A",
                "business"
              )}
              {renderDetail(
                "Start Date",
                account.startDate || "N/A",
                "date-range"
              )}
            </View>
          </Card.Content>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.subTitle}>Work History</Title>
            {account.workHistory && account.workHistory.length > 0 ? (
              account.workHistory.map((work, index) => (
                <View key={work._id} style={styles.workHistory}>
                  <Text style={Generate.bold}>Project {index + 1}:</Text>
                  <Text>- {work.title}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noHistoryText}>
                No work history available.
              </Text>
            )}
          </Card.Content>
        </Card>

        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Edit Account</Text>
            {Object.keys(updatedAccount).map((key) => (
              <TextInput
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={updatedAccount[key]}
                onChangeText={(text) =>
                  setUpdatedAccount({ ...updatedAccount, [key]: text || null })
                }
                style={styles.textInput}
              />
            ))}
            <Button mode="contained" onPress={handleUpdateAccount}>
              Update Account
            </Button>
          </ScrollView>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const renderDetail = (label, value, iconName) => (
  <View style={styles.detailContainer}>
    <Icon name={iconName} size={20} />
    <Text style={styles.detailLabel}>{label}: </Text>
    <Text>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#6200ee",
  },
  editButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 16,
  },
  noHistoryText: {
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  workHistory: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
});

export default AccountDetail;
