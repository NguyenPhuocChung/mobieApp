import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HomeManager from "../admin/Home";
import { fetchAccount } from "../api/apiservice";

const Manager = () => {
  const navigation = useNavigation();
  const [id, setId] = useState(null);
  const [data, setData] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái modal

  const loadData = async () => {
    try {
      const idUser = await AsyncStorage.getItem("userId");
      if (idUser) setId(idUser);
    } catch (error) {
      console.log("Error fetching data from AsyncStorage", error);
    }
  };

  const fetch = async () => {
    const accountData = await fetchAccount(id);
    setData(accountData);
  };

  useEffect(() => {
    loadData(); // Gọi loadData để lấy id người dùng
  }, []);

  useEffect(() => {
    fetch(); // Gọi fetch sau khi id đã được tải
  }, [id]);
  const handleLogout = async () => {
    try {
      // Xóa các thông tin đã lưu trong AsyncStorage
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userRole");
      await AsyncStorage.removeItem("userPassword");

      // Reset các state để không tự động đăng nhập lại

      console.log("Signed out");

      // Chuyển hướng về màn hình Login
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error clearing AsyncStorage during logout", error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Confirm Signout",
      "Are you sure you want to sign out?",
      [
        {
          text: "No",
          onPress: () => console.log("Signout canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleLogout(),
        },
      ],
      { cancelable: false }
    );
  };

  const renderModalContent = () => (
    <View style={styles.modalContainer}>
      <Text style={styles.drawerTitle}>Menu</Text>
      <TouchableOpacity
        style={styles.menuItemContainer}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={20} color="#4CAF50" />
        <Text style={styles.menuItem}>Signout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text style={styles.closeModal}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <StatusBar />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="menu-outline" size={30} style={styles.icon} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Ionicons name="people-outline" size={24} style={styles.icon} />
          <Text style={styles.projectTitle}>{data.fullName}</Text>
        </View>

        <TouchableOpacity>
          {data && data.avatar && (
            <Image
              source={{
                uri: `http://192.168.1.3:5000/${data.avatar}`,
              }}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
      </View>

      <HomeManager />

      {/* Modal cho menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false); // Đặt modal thành không hiển thị
        }}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1} // Đảm bảo không có phản hồi khi nhấn vào background
          onPress={() => setModalVisible(false)} // Đóng modal khi nhấn ra ngoài
        >
          <View style={styles.modalContainer}>{renderModalContent()}</View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 4,
    zIndex: 1,
  },
  icon: {
    color: "black",
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    height: "100%",
    padding: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuItem: {
    fontSize: 18,
    paddingLeft: 10,
  },
  closeModal: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
});

export default Manager;
