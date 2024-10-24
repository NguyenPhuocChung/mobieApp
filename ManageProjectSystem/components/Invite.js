// Invite.js
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import CheckBox from "react-native-check-box";
import { Dropdown } from "react-native-element-dropdown";
import Generatetylse from "../CSS/Generate";
import InvitePeople from "../CSS/Invite";
import styles from "../CSS/ManageTask";
import { fetchInviteMembers } from "../api/apiservice"; // Import hàm fetchInviteMembers

const Invite = () => {
  const [invite, setInvite] = useState([]); // Danh sách thành viên
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Quản lý trạng thái loading
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchInviteMembers(); // Gọi hàm từ api.js
      const formattedData = data.map((member) => ({
        label: member.fullName,
        value: member._id,
      }));

      setInvite(formattedData);
      console.log(formattedData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // Gọi hàm để lấy dữ liệu khi component mount
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={[styles.paddingRL, styles.margin_vertical]}>
        <Text style={InvitePeople.font_size_tittle}>Who has access</Text>
        <View
          style={[
            styles.d_flex,
            styles.justify_between,
            styles.margin_vertical,
          ]}
        >
          <Text style={InvitePeople.font_size_tittle_two}>Manage access</Text>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  search
                  data={invite} // Truyền dữ liệu đã format vào Dropdown
                  maxHeight={300}
                  labelField="label" // Trường label để hiển thị
                  valueField="value" // Trường giá trị để nhận dạng
                  searchPlaceholder="Search..."
                  placeholder="Select member"
                />

                {/* Nút Close */}
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Nút mở modal */}
          <Pressable
            style={[InvitePeople.button, InvitePeople.button]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={Generatetylse.textWhite}>AddNew</Text>
          </Pressable>
        </View>
      </View>
      <View style={[InvitePeople.box]}>
        <View
          style={[styles.d_flex, InvitePeople.horizol, InvitePeople.paddingTB]}
        >
          <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => setToggleCheckBox(!toggleCheckBox)}
            isChecked={toggleCheckBox}
            rightText={"Select all"}
          />
        </View>
        <View>
          <View style={[InvitePeople.searchContainer, styles.margin_vertical]}>
            <Image
              source={require("../img/search.png")} // Add your magnifying glass icon path here
              style={InvitePeople.searchIcon}
            />
            <TextInput
              style={[InvitePeople.searchInput, InvitePeople.font_size_content]}
              placeholder="Find a collaborator ..."
            />
          </View>
          <View style={[styles.d_flex, styles.margin_vertical]}>
            <CheckBox
              style={{ padding: 10 }}
              onClick={() => setToggleCheckBox(!toggleCheckBox)}
              isChecked={toggleCheckBox}
            />

            <View style={[styles.d_flex, styles.justify_between]}>
              <View style={[styles.d_flex, InvitePeople.margin_right]}>
                <Image
                  source={require("../img/z5735085240252_9117ca7de0843014f366550a8f1d7ef7.jpg")} // Thay link ảnh đại diện của bạn vào đây
                  style={[styles.avatar, InvitePeople.margin_right]}
                />
                <View>
                  <Text style={[InvitePeople.font_size_note]}>User 1</Text>
                  <Text style={[InvitePeople.font_size_note]}>
                    Awaiting minh22's response
                  </Text>
                </View>
              </View>

              <Text
                style={[InvitePeople.font_size_note, InvitePeople.marginRL]}
              >
                Leader
              </Text>

              <View style={styles.d_flex}>
                <Image
                  style={InvitePeople.img_edit}
                  source={require("../img/trash.png")}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Invite;
