import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import GenerateStyles from "../CSS/Generate";
import styles from "../CSS/ManageTask";
import { createProject } from "../api/apiservice";

const CreateProject = () => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [invite, setValue_invite] = useState(null);
  const [labels, setValue_labels] = useState(null);
  const [createrBy, setId] = useState(null);
  const [status, setStatus] = useState("Ônging");

  const getID = async () => {
    const data = await AsyncStorage.getItem("userId");
    if (data !== null) setId(data);
  };
  useEffect(() => {
    getID();
  }, []);

  // const [value_nameproject, setValue_nameproject] = useState(null);

  const [isFocus_invite, setIsFocus_invite] = useState(false);
  const [isFocus_labels, setIsFocus_labels] = useState(false);
  const [isFocus_nameproject, setIsFocus_nameproject] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  ////////////////////////////////////////////////////////////////
  // jh/////////////////
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };
  //////////////////////////////////

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    if (currentDate >= startDate && currentDate) {
      setShowEndDatePicker(false);
      setEndDate(currentDate);
      console.log(endDate);
      console.log(startDate instanceof Date); // Kiểm tra xem startDate có phải là một đối tượng Date không
    } else {
      alert("End date must be after or equal to start date");
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  //////////////////////////////////
  const invitePeople = [
    { label: "phuoc chung", value: "1" },
    { label: "Item 2", value: "67120e2ba149e5e80befa0ca" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];
  const Labels = [
    { label: "phuoc chung", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];
  const NameProject = [
    { label: "phuoc chung", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

  const handleClose = () => {
    setSuccessVisible(false);
    setErrorVisible(false);
  };

  const renderInvite = () => {
    return (
      <Text
        style={[
          styles.label,
          GenerateStyles.bold,
          isFocus_invite && { color: "blue" },
        ]}
      >
        Invite
      </Text>
    );
  };
  const renderLabels = () => {
    return (
      <Text
        style={[
          styles.label,
          GenerateStyles.bold,
          isFocus_labels && { color: "blue" },
        ]}
      >
        Labels
      </Text>
    );
  };

  const handleSubmit = async () => {
    // Tạo đối tượng dữ liệu từ các state
    console.log("createrBy", createrBy);

    const data = {
      title,
      description,
      startDate: startDate.toISOString(),
      startTime: startTime.toISOString(), // Chuyển đổi thời gian thành chuỗi ISO
      endDate: endDate.toISOString(), // Chuyển đổi thành chuỗi ISO
      endTime: endTime.toISOString(), // Chuyển đổi thành chuỗi ISO
      invite,
      labels,
      status,
      createrBy,
    };

    try {
      // Gửi yêu cầu POST đến API
      const response = await createProject(data);
      setSuccessVisible(true);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setErrorVisible(true);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[styles.form_create_task]}>
          <Dialog.Container visible={successVisible}>
            <Dialog.Title style={{ color: "green" }}>Success</Dialog.Title>
            <Dialog.Description style={{ color: "black" }}>
              Data submitted successfully!
            </Dialog.Description>
            <Dialog.Button label="OK" onPress={handleClose} />
          </Dialog.Container>
          <Dialog.Container visible={errorVisible}>
            <Dialog.Title style={{ color: "red" }}>Error</Dialog.Title>
            <Dialog.Description style={{ color: "black" }}>
              Failed to submit data!
            </Dialog.Description>
            <Dialog.Button label="OK" onPress={handleClose} />
          </Dialog.Container>
          <TextInput
            style={[
              styles.text_input,
              styles.margin_vertical,
              styles.font_size_content,
            ]}
            multiline
            numberOfLines={4}
            placeholder={"Text"}
            value={title}
            onChangeText={(title) => setTitle(title)}
          />
          <View
            style={[
              styles.control_content_task,
              { backgroundColor: "#F5F5F5" },
            ]}
          >
            <View style={styles.d_flex}>
              <Text
                style={[
                  styles.color,
                  styles.bold_word,
                  styles.margin_left,
                  styles.font_size,
                  styles.box_control_content_task,
                ]}
              >
                B
              </Text>
              <Text
                style={[
                  styles.color,
                  styles.margin_left,
                  styles.font_size,
                  styles.box_control_content_task,
                ]}
              >
                A
              </Text>
              <Text
                style={[
                  styles.color,
                  styles.italic,
                  styles.margin_left,
                  styles.font_size,
                  styles.box_control_content_task,
                ]}
              >
                I
              </Text>
              <Text
                style={[
                  styles.color,
                  styles.underline,
                  styles.margin_left,
                  styles.font_size,
                  styles.box_control_content_task,
                ]}
              >
                U
              </Text>
            </View>
            <View>
              <Image
                style={styles.import_img}
                source={require("../img/folder-plus.png")}
              />
            </View>
          </View>
          <View>
            <TextInput
              style={[styles.text_create_task, styles.font_size_content]}
              placeholder="Create a project"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={(description) => setDescription(description)}
            />
          </View>
          <View>
            <View
              style={[GenerateStyles.marginVertical, GenerateStyles.box_create]}
            >
              <View>
                {renderInvite()}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus_invite && { borderColor: "blue" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={invitePeople}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus_invite ? "Invite" : "..."}
                  searchPlaceholder="Search..."
                  value={invite}
                  onFocus={() => setIsFocus_invite(true)}
                  onBlur={() => setIsFocus_invite(false)}
                  onChange={(item) => {
                    setValue_invite(item.value);
                    setIsFocus_invite(false);
                  }}
                  renderLeftIcon={() => (
                    <Image
                      source={require("../img/invite.png")}
                      style={{ width: 12.67, height: 14 }}
                    />
                  )}
                />
              </View>
              <View style={[GenerateStyles.marginVertical]}>
                {renderLabels()}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus_labels && { borderColor: "blue" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={Labels}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus_labels ? "Labels" : "..."}
                  searchPlaceholder="Search..."
                  value={labels}
                  onFocus={() => setIsFocus_labels(true)}
                  onBlur={() => setIsFocus_labels(false)}
                  onChange={(item) => {
                    setValue_labels(item.value);
                    setIsFocus_labels(false);
                  }}
                  renderLeftIcon={() => (
                    <Image
                      source={require("../img/tag.png")} // Đường dẫn đến hình của bạn
                      style={{ width: 12.67, height: 14 }} // Kích thước hình ảnh
                    />
                  )}
                />
              </View>
              {/* <View>
                {renderNameProject()}
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus_nameproject && { borderColor: "blue" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={NameProject}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus_nameproject ? "Project" : "..."}
                  searchPlaceholder="Search..."
                  value={""}
                  onFocus={() => setIsFocus_nameproject(true)}
                  onBlur={() => setIsFocus_nameproject(false)}
                  onChange={(item) => {
                    setValue_nameproject(item.value);
                    setIsFocus_nameproject(false);
                  }}
                  renderLeftIcon={() => (
                    <Image source={require("../img/nameproject.png")} />
                  )}
                />
              </View> */}
            </View>
          </View>
          <View
            style={[
              GenerateStyles.marginVertical,
              { alignItems: "center", justifyContent: "space-between" },
            ]}
          >
            <View style={[GenerateStyles.box_time]}>
              <View>
                <Text style={[GenerateStyles.bold]}>Start Time</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#CDCDE6",
                    borderRadius: 5,
                    paddingVertical: 5,
                    borderWidth: 1,
                    width: "auto",
                  }}
                >
                  <View>
                    <TextInput
                      style={{
                        width: 120,
                        textAlign: "center",
                      }}
                      value={startDate.toDateString()}
                      onFocus={() => setShowStartDatePicker(true)}
                    />
                    {showStartDatePicker && (
                      <DateTimePicker
                        testID="datePicker"
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={onChangeStartDate}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      width: 1,
                      height: 20,
                      backgroundColor: "#CDCDE6",
                    }}
                  ></Text>
                  <View style={{ paddingLeft: 5 }}>
                    <TextInput
                      style={{
                        width: 20,
                        textAlign: "center",
                      }}
                      value={String(startTime.getHours())}
                      onFocus={() => setShowStartTimePicker(true)}
                    />
                  </View>
                  <View>
                    <Text style={[{ paddingBottom: 3, textAlign: "center" }]}>
                      :
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      style={{
                        width: 20,
                        textAlign: "center",
                      }}
                      value={String(startTime.getMinutes())}
                      onFocus={() => setShowStartTimePicker(true)}
                    />
                  </View>

                  <View>
                    <TextInput
                      style={{
                        width: 20,
                        textAlign: "center",
                      }}
                      value={startTime.getHours() >= 12 ? "PM" : "AM"}
                      editable={false}
                    />
                  </View>
                </View>

                {showStartTimePicker && (
                  <DateTimePicker
                    testID="timePicker"
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onChangeStartTime}
                  />
                )}
              </View>
              <View>
                <Text style={[GenerateStyles.bold]}>End Time</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#CDCDE6",
                    borderRadius: 5,
                    paddingVertical: 5,
                    borderWidth: 1,
                    width: 200,
                  }}
                >
                  <View>
                    <TextInput
                      style={{
                        width: 120,
                        textAlign: "center",
                      }}
                      value={endDate.toDateString()}
                      onFocus={() => setShowEndDatePicker(true)}
                    />
                    {showEndDatePicker && (
                      <DateTimePicker
                        testID="datePicker"
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={onChangeEndDate}
                      />
                    )}
                  </View>
                  <Text
                    style={{ width: 1, height: 20, backgroundColor: "#CDCDE6" }}
                  ></Text>
                  <View style={{ paddingLeft: 5 }}>
                    <TextInput
                      style={{
                        width: 20,
                        textAlign: "center",
                      }}
                      value={String(endTime.getHours())}
                      onFocus={() => setShowEndTimePicker(true)}
                    />
                  </View>
                  <View>
                    <Text style={[{ paddingBottom: 3, textAlign: "center" }]}>
                      :
                    </Text>
                  </View>

                  <View>
                    <TextInput
                      style={{
                        width: 20,
                        textAlign: "center",
                      }}
                      value={String(endTime.getMinutes())}
                      onFocus={() => setShowEndTimePicker(true)}
                    />
                  </View>

                  <View>
                    <TextInput
                      style={{
                        width: 20,
                        textAlign: "center",
                      }}
                      value={endTime.getHours() >= 12 ? "PM" : "AM"}
                      editable={false}
                    />
                  </View>
                </View>

                {showEndTimePicker && (
                  <DateTimePicker
                    testID="timePicker"
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onChangeEndTime}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={[GenerateStyles.marginTop]}>
            <TouchableHighlight underlayColor="red" onPress={handleSubmit}>
              <View style={styles.button}>
                <Text style={GenerateStyles.textWhite}>Create project</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateProject;
