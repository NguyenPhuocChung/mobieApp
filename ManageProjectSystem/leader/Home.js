import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import useFocusEffect
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const navigation = useNavigation();
  const lineWidth = useRef(new Animated.Value(0)).current; // Khởi tạo Animated.Value

  useEffect(() => {
    Animated.timing(lineWidth, {
      toValue: 50,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    const backAction = () => {
      // Kiểm tra xem có phải là trang Home không
      if (navigation.canGoBack()) {
        navigation.goBack(); // Nếu có, quay lại trang trước đó
        return true; // Đã xử lý sự kiện
      } else {
        Alert.alert("Notification", "Are you sure you want to exit the app?", [
          {
            text: "No",
            onPress: () => null,
            style: "cancel",
          },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Hủy đăng ký khi component unmount
  }, [navigation, lineWidth]);

  // Sử dụng useFocusEffect để reload dữ liệu khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      // Load dữ liệu hoặc thực hiện hành động cần thiết ở đây
      console.log("Home screen is focused");
      // Bạn có thể gọi một hàm fetch dữ liệu ở đây nếu cần

      return () => {
        // Clean up nếu cần
      };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <Section title="Notification">
          <IconCard icon="notifications-outline" title="Notification" />
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
        <Section title="Manager">
          <IconCard
            icon="briefcase-outline"
            title="Manager Task"
            onPress={() =>
              navigation.navigate("ManageTask", {
                name: "ManageTask",
              })
            }
          />
          <IconCard
            icon="grid-outline"
            title="Dashboard"
            onPress={() => navigation.navigate("DashBoardLeader")}
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
        <Section title="Status all task">
          <IconCard
            icon="list-outline"
            title="Show All Task"
            onPress={() =>
              navigation.navigate("StatusAllTask", {
                name: "StatusAllTask",
              })
            }
          />
        </Section>
      </View>
    </ScrollView>
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
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    marginTop: 50,
    marginBottom: 90,
    paddingBottom: 20,
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
