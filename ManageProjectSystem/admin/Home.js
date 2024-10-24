import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const navigation = useNavigation();
  const lineWidth = useRef(new Animated.Value(0)).current; // Khởi tạo Animated.Value

  useEffect(() => {
    // Bắt đầu animation khi component được mount
    Animated.timing(lineWidth, {
      toValue: 50, // Đến 50%
      duration: 1000, // Thời gian animation (1 giây)
      useNativeDriver: false, // Sử dụng Native Driver
    }).start();
  }, [lineWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Section title="Notification">
          <IconCard icon="notifications" title="Notification" />
        </Section>
        {/* Đường kẻ ngang với animation */}
        <Animated.View
          style={[
            styles.line,
            {
              width: lineWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "50%"],
              }),
            },
          ]}
        />
        <Section title="Manager">
          <IconCard
            icon="briefcase"
            title="Manager Project"
            onPress={() =>
              navigation.navigate("Project", {
                name: "Project",
              })
            } // Điều hướng đến Manager Project
          />

          <IconCard
            icon="person"
            title="Manager Member"
            onPress={() => navigation.navigate("ManageMember")} // Điều hướng đến Manager Member
          />
        </Section>
        <Animated.View
          style={[
            styles.line,
            {
              width: lineWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "50%"],
              }),
            },
          ]}
        />
        {/* manage status all task */}
        <Section title="Status all task">
          <IconCard
            icon="list"
            title="Manager Task"
            onPress={() =>
              navigation.navigate("StatusAllTask", {
                name: "StatusAllTask",
              })
            } // Điều hướng đến Manager Project
          />
        </Section>
      </View>
    </View>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.iconContainer}>{children}</View>
  </View>
);

const IconCard = ({ icon, title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.iconCard}>
    <Ionicons name={icon} size={48} color="green" />
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  line: {
    height: 1, // Chiều cao của đường kẻ
    backgroundColor: "gray", // Màu nền của đường kẻ
    marginVertical: 10, // Khoảng cách trên và dưới đường kẻ
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginTop: 50,
  },
  main: {
    flex: 1,
    alignItems: "center",
  },
  section: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#3B82F6",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  iconCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "center",
    width: "40%",
  },
  cardTitle: {
    color: "#333333",
    fontWeight: "600",
    marginTop: 8,
  },
});

export default Home;
