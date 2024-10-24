import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DetailDailyMeetingStyles from "../CSS/DetaildailyMeeting";
import GenerateStyles from "../CSS/Generate";
import { deleteCalendarData, updateCalendarData } from "../api/apiservice";

const DetailDailytMeeting = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meeting, startTime, endTime } = route.params;

  // Trạng thái cho việc cập nhật tiêu đề và mô tả
  const [updatedTitle, setUpdatedTitle] = useState(meeting.title);
  const [updatedDescription, setUpdatedDescription] = useState(
    meeting.description
  );

  const handleLinkPress = () => {
    Linking.openURL("https://meet.google.com/zks-kogz-afi");
  };

  const deleteCalendaring = async (id) => {
    try {
      const response = await deleteCalendarData(id);
      console.log("Calendaring deleted successfully", response.data);
      Alert.alert("Success", "Deleted successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting calendaring:", error.message);
      Alert.alert("Error", "Failed to delete calendaring.");
    }
  };

  const updateCalendaring = async (id) => {
    const updatedData = {
      title: updatedTitle, // Sử dụng dữ liệu từ TextInput
      description: updatedDescription, // Sử dụng dữ liệu từ TextInput
      status: "updated",
    };
    try {
      const response = await updateCalendarData(id, updatedData);
      console.log("Calendaring updated successfully", response.data);
      Alert.alert("Success", "Updated successfully!");
    } catch (error) {
      console.error("Error updating calendaring:", error.message);
      Alert.alert("Error", "Failed to update calendaring.");
    }
  };

  return (
    <View style={DetailDailyMeetingStyles.container}>
      <Text style={DetailDailyMeetingStyles.font_size_title}>
        {meeting.title}
      </Text>
      <Text
        style={[
          DetailDailyMeetingStyles.font_size_description,
          GenerateStyles.marginVertical,
        ]}
      >
        {meeting.description}
      </Text>

      {/* Thông tin thời gian */}
      <View style={GenerateStyles.d_flex_align_center}>
        <View
          style={[
            GenerateStyles.d_flex_align_center,
            DetailDailyMeetingStyles.width,
          ]}
        >
          <Image
            style={GenerateStyles.marginRight}
            source={require("../img/clock.png")}
          />
          <Text>Time</Text>
        </View>
        <Text style={GenerateStyles.bold}>
          {startTime}
          <Image source={require("../img/arrow-right.png")} /> {endTime}
        </Text>
      </View>

      {/* Thông tin liên kết */}
      <View style={GenerateStyles.d_flex_align_center}>
        <View
          style={[
            GenerateStyles.d_flex_align_center,
            DetailDailyMeetingStyles.width,
          ]}
        >
          <Image
            style={GenerateStyles.marginRight}
            source={require("../img/link-2.png")}
          />
          <Text>Link</Text>
        </View>
        <TouchableOpacity onPress={handleLinkPress}>
          <Text
            style={[
              GenerateStyles.bold,
              GenerateStyles.italic,
              GenerateStyles.underline,
            ]}
          >
            {meeting.link}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin người tạo */}
      <View style={GenerateStyles.d_flex_align_center}>
        <View
          style={[
            GenerateStyles.d_flex_align_center,
            DetailDailyMeetingStyles.width,
          ]}
        >
          <Image
            style={GenerateStyles.marginRight}
            source={require("../img/user.png")}
          />
          <Text>Creator</Text>
        </View>
        <Text style={GenerateStyles.bold}>
          {meeting.creater}
          <Text style={[GenerateStyles.textDanger]}> (Leader)</Text>
        </Text>
      </View>

      {/* Thông tin trạng thái */}
      <View style={GenerateStyles.d_flex_align_center}>
        <View
          style={[
            GenerateStyles.d_flex_align_center,
            DetailDailyMeetingStyles.width,
          ]}
        >
          <Image
            style={GenerateStyles.marginRight}
            source={require("../img/pie-chart.png")}
          />
          <Text>Status</Text>
        </View>
        <View
          style={[
            GenerateStyles.d_flex_align_center,
            DetailDailyMeetingStyles.detailText,
            GenerateStyles.box_status,
            GenerateStyles.box_status_notstarted,
            GenerateStyles.color_notstarted,
          ]}
        >
          <Text
            style={[
              GenerateStyles.point,
              GenerateStyles.point_notstarted,
              GenerateStyles.marginRight,
            ]}
          />
          <Text>{meeting.status}</Text>
        </View>
      </View>

      {/* Nút cập nhật và xóa */}
      <View style={GenerateStyles.d_flex_align_center}>
        <TouchableOpacity
          onPress={() => updateCalendaring(meeting._id)}
          style={[GenerateStyles.box_status_done, GenerateStyles.box]}
        >
          <Text style={[GenerateStyles.color_done]}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteCalendaring(meeting._id)}
          style={[
            GenerateStyles.box_status_cancle,
            GenerateStyles.box,
            GenerateStyles.marginRight,
          ]}
        >
          <Text style={[GenerateStyles.color_cancle]}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* TextInput để nhập dữ liệu cập nhật */}
      <View
        style={[
          GenerateStyles.d_flex_align_center,
          GenerateStyles.marginVertical,
        ]}
      >
        <TextInput
          style={[
            DetailDailyMeetingStyles.input,
            GenerateStyles.marginVertical,
          ]}
          placeholder="Update Title"
          value={updatedTitle} // Đặt giá trị cho TextInput
          onChangeText={setUpdatedTitle} // Cập nhật giá trị khi nhập
        />
        <TextInput
          style={[
            DetailDailyMeetingStyles.input,
            GenerateStyles.marginVertical,
          ]}
          placeholder="Update Description"
          value={updatedDescription} // Đặt giá trị cho TextInput
          onChangeText={setUpdatedDescription} // Cập nhật giá trị khi nhập
          multiline
        />
      </View>

      <Text
        style={[GenerateStyles.horizol_line_traight, GenerateStyles.mb2]}
      ></Text>
    </View>
  );
};

export default DetailDailytMeeting;
