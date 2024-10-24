import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Generate from "../CSS/Generate";
import { deleteAccount, getAllAccounts } from "../api/apiservice"; // Import your API functions

const MemberManagement = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [refreshing, setRefreshing] = useState(false); // Trạng thái refreshing
  const handleDeleteMember = async () => {
    try {
      await deleteAccount(memberToDelete);
      setMembers(members.filter((member) => member._id !== memberToDelete));
      setFilteredMembers(
        filteredMembers.filter((member) => member._id !== memberToDelete)
      );
      setConfirmationModalVisible(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = members.filter((member) =>
        member.fullName
          ? member.fullName.toLowerCase().includes(query.toLowerCase())
          : false
      );
      setFilteredMembers(filteredData);
    } else {
      setFilteredMembers(members);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const data = await getAllAccounts();
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Đánh dấu rằng việc tải dữ liệu đã hoàn tất
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Find members"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />
      <Icon
        name="add"
        size={30}
        color="blue"
        onPress={() => navigation.navigate("Register")}
      />
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={styles.memberItem}>
            <Text>{index + 1}</Text>
            <Text>{item.fullName || "null"}</Text>
            <Text>{item.role}</Text>
            <View style={[Generate.d_flex_align_center, { gap: 10 }]}>
              <Icon
                name="delete"
                size={24}
                color="red"
                onPress={() => {
                  setMemberToDelete(item._id);
                  setConfirmationModalVisible(true);
                }}
              />
              <Icon
                name="info"
                size={24}
                color="green"
                onPress={() => {
                  setSelectedMember(item);
                  setModalVisible(true);
                }}
              />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Trạng thái refreshing
            onRefresh={fetchMembers} // Hàm gọi lại khi kéo refresh
          />
        }
      />

      <Modal
        visible={confirmationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this member?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setConfirmationModalVisible(false)}
              />
              <Button
                title="Delete"
                onPress={handleDeleteMember}
                color="#FF6A6A"
              />
            </View>
          </View>
        </View>
      </Modal>

      {selectedMember && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text>Full Name: {selectedMember.fullName}</Text>
            <Text>Email: {selectedMember.email}</Text>
            <Text>Role: {selectedMember.role}</Text>
            <Text>Phone: {selectedMember.phone || "null"}</Text>
            <Text>Address: {selectedMember.address || "null"}</Text>
            <Text>Birth Date: {selectedMember.birthDate || "null"}</Text>
            <Text>Department: {selectedMember.department || "null"}</Text>
            <Text>Position: {selectedMember.position || "null"}</Text>
            <Text>Salary: {selectedMember.salary || "null"}</Text>
            <Text>Start Date: {selectedMember.startDate || "null"}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default MemberManagement;
