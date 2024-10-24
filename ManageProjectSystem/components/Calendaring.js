// Import các thư viện cần thiết
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome"; // Hoặc bộ biểu tượng bạn chọn

import {
  FlatList,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import các file CSS
import CalenderingStyle from "../CSS/Calendering";
import GenerateStyles from "../CSS/Generate";
import styles from "../CSS/ManageTask";
import { fetchCalendarData } from "../api/apiservice"; // Import hàm fetchCalendarData

// Component chính của ứng dụng
const Calendaring = ({ navigation }) => {
  // Initialize date and show state
  // const [startDate, setStartDate] = useState(new Date());
  // //
  // const [endDate, setEndDate] = useState(new Date());
  // const [endTime, setEndTime] = useState(new Date());
  const today = new Date();
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  //
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDataFromDate(); // Your data fetching logic
    setRefreshing(false);
  };
  // Hàm liên kết tới Google Meet
  const linkGoogleMeet = () => {
    const url = "https://meet.google.com/zks-kogz-afi";
    Linking.openURL(url);
  };

  // Hàm lấy tên ngày trong tuần
  const getDayOfWeek = (day) => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days[day];
  };

  // Hàm tạo danh sách các ngày trong tuần
  const generateWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        day: getDayOfWeek(date.getDay()),
        date: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    return dates;
  };

  const dates = generateWeekDates(currentWeekStart);

  // Hàm xử lý thay đổi ngày
  const handleDateChange = (event, date) => {
    if (event.type === "set" && date) {
      setShowDatePicker(false);
      setCurrentWeekStart(date);
      const todayIndex = generateWeekDates(date).findIndex((d) => d.isToday);
      setSelectedDateIndex(todayIndex);
      setSelectedDate(date);
    } else {
      setShowDatePicker(false); // Đóng picker nếu hủy
    }
  };

  // Hàm xử lý khi người dùng chọn một ngày
  const handleDatePress = (index) => {
    setSelectedDateIndex(index);
    const date = dates[index];
    const newDate = new Date(today.getFullYear(), today.getMonth(), date.date);
    setSelectedDate(newDate);
    getDataFromDate(selectedDate);
  };

  // Hàm xử lý khi người dùng nhấn "Today"
  const handleTodayPress = () => {
    setCurrentWeekStart(today);
    const todayIndex = dates.findIndex((date) => date.isToday);
    setSelectedDateIndex(todayIndex);
    setSelectedDate(today);
    console.log(selectedDate);
  };

  // Hàm xử lý chuyển sang tuần tiếp theo
  const handleNextWeek = () => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStartDate);
  };
  const handlePreviousWeek = () => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStartDate);
  };
  const getDataFromDate = async () => {
    try {
      // Lấy ngày hiện tại dạng YYYY-MM-DD
      const calendarData = await fetchCalendarData(selectedDate); // Gọi API với ngày hiện tại
      setcalendarGetDate(calendarData); //
      console.log("chung", calendarGetDate);
    } catch (error) {
      console.log("lo mang roi huhu");
    }
  };
  useEffect(() => {
    getDataFromDate();
  }, [selectedDate]);

  const loadMoreData = () => {
    // Logic tải lại dữ liệu ở đây
    // Bạn có thể thực hiện gọi API hoặc thêm dữ liệu mới vào state
    console.log("Loading more data...");
    // Ví dụ: setCalendar([...calendar, ...newData]); // thêm dữ liệu mới vào danh sách
  };
  // // // // // // // //
  const route = useRoute();
  const { calendar } = route.params;
  const [calendarGetDate, setcalendarGetDate] = useState(calendar);
  // /// // // // // //
  const renderItem = ({ item }) => {
    // Kiểm tra nếu item không có dữ liệu (length === 0)

    const startTime = item.startTime ? new Date(item.startTime) : null;
    const endTime = item.endTime ? new Date(item.endTime) : null;

    // Định dạng thời gian bắt đầu và kết thúc
    const startTimeChanged = startTime
      ? startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A"; // Giá trị mặc định nếu startTime là null

    const endTimeChanged = endTime
      ? endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A"; // Giá trị mặc định nếu endTime là null

    return (
      <View style={[GenerateStyles.d_flex, GenerateStyles.marginVertical]}>
        <Text
          style={[
            GenerateStyles.backGroundblue,
            GenerateStyles.witdhTime,
            GenerateStyles.sizeDescription,
            GenerateStyles.bold,
          ]}
        >
          {startTimeChanged}
        </Text>

        <View
          style={[
            GenerateStyles.backGroundred,
            GenerateStyles.witdhMeeting,
            GenerateStyles.padding,
            CalenderingStyle.box,
            GenerateStyles.positions,
          ]}
        >
          <View style={[styles.d_flex, GenerateStyles.absolute]}>
            <Text
              style={[GenerateStyles.sizeSubtext, GenerateStyles.colorTime]}
            >
              {startTimeChanged}
            </Text>
            <Image source={require("../img/arrow-right.png")} />
            <Text
              style={[GenerateStyles.sizeSubtext, GenerateStyles.colorTime]}
            >
              {endTimeChanged}
            </Text>
          </View>

          <Text style={[GenerateStyles.sizeTitles, GenerateStyles.color]}>
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
                startTime: startTimeChanged,
                endTime: endTimeChanged,
              })
            }
          >
            {item.description}
          </Text>

          <TouchableOpacity
            style={[
              CalenderingStyle.buttonMeeting,
              styles.d_flex,
              GenerateStyles.marginVertical,
            ]}
            onPress={linkGoogleMeet}
          >
            <Image
              style={[
                CalenderingStyle.img_googleMeet,
                GenerateStyles.marginRight,
              ]}
              source={require("../img/googlemeet.png")}
            />
            <Text
              style={[
                GenerateStyles.text_color_blue,
                CalenderingStyle.colorWhite,
              ]}
            >
              {item.link}
            </Text>
          </TouchableOpacity>

          <View style={[GenerateStyles.d_flex, GenerateStyles.justify_between]}>
            <View style={GenerateStyles.d_flex}>
              <Image
                style={[GenerateStyles.marginRight]}
                source={require("../img/Group 52.png")}
              />
              <Text
                style={[GenerateStyles.sizeSubtext, GenerateStyles.colorTime]}
              >
                {item.creater}
              </Text>
            </View>
            <View style={GenerateStyles.d_flex_align_center}>
              <Image
                style={[CalenderingStyle.img_Highlight]}
                source={require("../img/Group 52.png")}
              />
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
      </View>
    );
  };

  return (
    <SafeAreaView>
      {/* Header hiển thị ngày và nút chọn ngày */}
      <View
        style={[
          CalenderingStyle.headerContainer,
          GenerateStyles.d_flex_align_center,
          GenerateStyles.justify_around,
        ]}
      >
        <View style={GenerateStyles.d_flex_align_center}>
          <Text style={CalenderingStyle.dateText}>
            {selectedDate.getDate()}
          </Text>
          <View style={GenerateStyles.marginHorizonal}>
            <Text style={CalenderingStyle.dayText}>
              {selectedDate.toLocaleDateString("en-US", { weekday: "short" })}
            </Text>
            <Text style={CalenderingStyle.monthText}>
              {selectedDate.toLocaleString("default", { month: "long" })}{" "}
              {selectedDate.getFullYear()}
            </Text>
          </View>
        </View>

        {/* button show modal----------------------------- */}
        <View style={CalenderingStyle.buttonContainer}>
          <TouchableOpacity style={CalenderingStyle.addButton}>
            <Pressable
              style={CalenderingStyle.addButton}
              onPress={() => {
                navigation.navigate("AddEvent", {
                  name: "AddEvent",
                  startDate: selectedDate,
                });
              }}
            >
              <Text
                style={[GenerateStyles.textCenter, GenerateStyles.textWhite]}
              >
                Add Event
              </Text>
            </Pressable>
          </TouchableOpacity>
          <TouchableOpacity
            style={CalenderingStyle.todayButton}
            onPress={handleTodayPress}
          >
            <Text style={CalenderingStyle.buttonTextToday}>Today</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* end--------------------------- */}

      {/* Nút chọn ngày-------------------------------------------------- */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={CalenderingStyle.selectDateButton}
      >
        <Text style={CalenderingStyle.buttonTextSelectDate}>Choose Date</Text>
      </TouchableOpacity>

      {/* Hiển thị DateTimePicker----------------------------------------- */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Dấu phân cách */}
      <Text style={[GenerateStyles.horizol_line_traight]}></Text>
      {/* --------------------- */}
      {/* Các nút chuyển tuần và hiển thị ngày trong tuần */}
      <View
        style={[
          GenerateStyles.d_flex_align_center,
          GenerateStyles.justify_between,
          GenerateStyles.marginHorizonal,
          GenerateStyles.marginVertical,
        ]}
      >
        <TouchableOpacity onPress={handlePreviousWeek}>
          <View>
            <Image source={require("../img/chevron-left.png")} />
          </View>
        </TouchableOpacity>

        {dates.map((date, index) => (
          <TouchableOpacity key={index} onPress={() => handleDatePress(index)}>
            <View
              style={{
                backgroundColor:
                  selectedDateIndex === index
                    ? "green"
                    : selectedDate.getDate() === date.date &&
                      selectedDate.getMonth() ===
                        new Date(currentWeekStart).getMonth() &&
                      selectedDate.getFullYear() ===
                        new Date(currentWeekStart).getFullYear()
                    ? "green" // Nếu selectedDate trùng với ngày trong mảng
                    : date.isToday
                    ? "blue"
                    : "black",
                padding: 10,
                margin: 5,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>{date.day}</Text>
              <Text style={{ color: "white" }}>{date.date}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleNextWeek}>
          <View>
            <Image source={require("../img/chevron-right.png")} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Dấu phân cách */}
      <Text style={[GenerateStyles.horizol_line_traight]}></Text>
      {/* ------------------ */}
      {/* Hiển thị danh sách các cuộc họp */}
      <View style={GenerateStyles.backGroundWhite}>
        <View style={[styles.d_flex, GenerateStyles.marginVertical]}>
          <Text
            style={[
              GenerateStyles.witdhTime,
              CalenderingStyle.colorTime,
              GenerateStyles.marginRight,
            ]}
          >
            Time
          </Text>
          <Text style={[GenerateStyles.witdhMeeting]}>Meeting</Text>
        </View>
      </View>

      <FlatList
        data={calendarGetDate}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        style={{ marginBottom: 410 }}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View>
            <Text style={[GenerateStyles.textCenter]}>
              <Icon name="calendar-times-o" size={100} color="#FF0000" />
            </Text>
            <Text
              style={[
                GenerateStyles.bold,
                GenerateStyles.textCenter,
                GenerateStyles.marginVertical,
              ]}
            >
              Not meeting!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Calendaring;
