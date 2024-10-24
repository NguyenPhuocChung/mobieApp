import React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const chung = [
  {
    id: "1",
    title:
      "[P.ĐT] Thông báo DSSV không đủ điều kiện dự thi điểm danh các môn DTR103, ENT001, ENT104, ENT203, ENT303, ENT403, ENT503, VOV114 half 1 kỳ FA24",
    date: "19/10/2024",
  },
  {
    id: "2",
    title:
      "[Khảo thí] Thông báo lịch progress test các môn AFA201, DRP101, TPG302 kỳ FA24",
    date: "16/10/2024",
  },
  {
    id: "3",
    title: "[Khảo thí] Thông báo lịch thi thực hành các môn kỳ FA24",
    date: "16/10/2024",
  },
  {
    id: "4",
    title:
      "[Khảo thí] Thông báo điều chỉnh lịch thi thực hành môn PRN212 kỳ FA24",
    date: "15/10/2024",
  },
  {
    id: "5",
    title:
      "[P.ĐT] Thông báo DSSV không đủ điều kiện dự thi điểm danh môn KRL112 half 1 kỳ FA24",
    date: "13/10/2024",
  },
];

const Notification = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.input} placeholder="Search..." />
        <Button title="🔍" onPress={() => {}} color="#ff9800" />
      </View>
      <Text style={styles.resultText}>Showing {chung.length} results</Text>
      <FlatList
        data={chung}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text>{item.title}</Text>
            <Text style={styles.dateText}>Date: {item.date}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        <FontAwesome name="home" size={24} color="white" />
        <FontAwesome name="bell" size={24} color="white" />
        <FontAwesome name="user" size={24} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
  },
  header: {
    backgroundColor: "#ff9800",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 10,
    top: 12,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  input: {
    width: "80%",
    padding: 10,
    borderColor: "#ff9800",
    borderWidth: 1,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  notificationItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    color: "#808080", // màu xám
    marginTop: 5,
  },
  resultText: {
    textAlign: "center",
    marginVertical: 10,
  },
  footer: {
    backgroundColor: "#ff9800",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default Notification;
