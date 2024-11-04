import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchCalendar } from "../api/calendarService";
import CalenderingStyle from "../CSS/Calendering";
import GenerateStyles from "../CSS/Generate";
import URL from "../midleware/authMidleware";

const Notification = ({ navigation }) => {
  const [calendarGetDate, setCalendarGetDate] = useState([]);
  const [chung, setChung] = useState([]); // Original calendar data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  const getData = async () => {
    try {
      const calendarData = await fetchCalendar(); // Fetch data from API
      setCalendarGetDate(calendarData);
      setChung(calendarData); // Assuming you want to use 'calendarData' here
      setFilteredData(calendarData); // Initialize filtered data
      console.log("Data fetched: ", calendarData);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await getData(); // Fetch new data when refreshing
    setRefreshing(false);
  };

  // Handle search input and filter the results
  const handleSearch = (text) => {
    setSearchTerm(text);

    // Filter the data based on the search term
    if (text) {
      const filtered = chung.filter((item) =>
        item.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(chung); // Reset to original data when search is cleared
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={handleSearch} // Handle search input
        />
      </View>
      <Text style={styles.resultText}>
        Showing {filteredData.length} results
      </Text>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text
              style={[GenerateStyles.sizeTitles, GenerateStyles.color]}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              style={[
                GenerateStyles.italic,
                GenerateStyles.sizeDescription,
                GenerateStyles.color,
              ]}
              ellipsizeMode="tail"
              onPress={() =>
                navigation.navigate("DetailMeeting", {
                  name: "DetailMeeting",
                  meeting: item,
                  startTime: item.startTime,
                  endTime: item.endTime,
                })
              }
            >
              {item.description}
            </Text>

            <TouchableOpacity
              style={[
                CalenderingStyle.buttonMeeting,
                GenerateStyles.d_flex_align_center,
                GenerateStyles.marginVertical,
              ]}
              onPress={() => console.log("Google Meet link:", item.link)}
            >
              <Image
                style={[
                  CalenderingStyle.img_googleMeet,
                  GenerateStyles.marginRight,
                ]}
                source={require("../img/googlemeet.png")}
              />
              <Text
                style={{
                  color: "blue",
                  textDecorationLine: "underline",
                }}
              >
                {item.link}
              </Text>
            </TouchableOpacity>

            <View
              style={[
                GenerateStyles.d_flex_align_center,
                GenerateStyles.justify_between,
              ]}
            >
              <View style={[GenerateStyles.d_flex]}>
                <Image
                  source={{
                    uri: `http://${URL.BASE_URL}:5000/${item.createrBy.avatar}`,
                  }}
                  style={styles.avatar}
                />
                <Text
                  style={[
                    { marginLeft: 10 },
                    GenerateStyles.sizeSubtext,
                    GenerateStyles.colorTime,
                  ]}
                >
                  {item.createrBy?.fullName || "Unknown Creator"}{" "}
                  {/* Display fullName or fallback */}
                </Text>
              </View>
              <View style={GenerateStyles.d_flex_align_center}>
                <Text
                  style={
                    item.status === "online"
                      ? GenerateStyles.red
                      : GenerateStyles.green
                  }
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } // Adding pull-to-refresh control
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    marginBottom: 100,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  input: {
    width: "80%",
    padding: 10,
    borderColor: "#ff9800",
    borderWidth: 1,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  resultText: {
    textAlign: "center",
    marginVertical: 10,
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
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default Notification;
