import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { fetchProjectByInvite } from "../api/apiservice";
import GenerateStyles from "../CSS/Generate";
import styles from "../CSS/ManageTask";

const ManageTask = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [inviteId, setInviteId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm

  const loadTask = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const userID = await AsyncStorage.getItem("userId");
      console.log(userID);
      if (userID) {
        setInviteId(userID); // Set inviteId when userID is available
        const data = await fetchProjectByInvite(userID); // Fetch projects using userID
        console.log("Fetched Projects:", data);
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message); // Capture error message
      console.log("Error fetching data:", err.message); // Log actual error message
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTask(); // Call to load projects
  }, [inviteId]); // Add inviteId to dependencies

  const renderItem = ({ item }) => (
    <View style={[styles.d_flex, styles.box_main_task]}>
      <TouchableOpacity>
        <Image
          style={[styles.draggable, styles.margin_right]}
          source={require("../img/draggable.png")}
        />
      </TouchableOpacity>
      <View style={[styles.box_task, styles.margin_vertical]}>
        <Text style={[styles.fontSize_title]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={[styles.text_task, styles.margin_bottom]}
          numberOfLines={2}
          onPress={() =>
            navigation.navigate("ListTask", {
              name: "ListTask",
              data: item,
            })
          }
        >
          {item.description}
        </Text>
        <View style={[styles.d_flex, styles.justify_between]}>
          <View
            style={[
              styles.box_status,
              styles.d_flex,
              styles.paddingRL,
              item.status === "Ongoing"
                ? styles.box_status_done
                : item.status === "Progress"
                ? styles.box_status_progress
                : styles.box_status_notstarted,
            ]}
          >
            <Text style={[styles.point, styles.point_progress]}></Text>
            <Text
              style={[
                styles.padding_right,
                item.status === "Ongoing"
                  ? styles.color_done
                  : item.status === "Progress"
                  ? styles.color_progress
                  : styles.color_notstarted,
                styles.font_size_content,
              ]}
            >
              {item.status}
            </Text>
          </View>
          <View style={[styles.box_status, styles.d_flex, styles.paddingRL]}>
            <Image
              style={[styles.delete_img, styles.padding_right]}
              source={require("../img/user-add-line.png")}
            />
            <Text
              style={[styles.padding_right, styles.font_size_content]}
              onPress={() =>
                navigation.navigate("Invite", {
                  name: "Invite",
                })
              }
            >
              Invite
            </Text>
          </View>
          <View style={[styles.d_flex, styles.paddingRL]}>
            <Image
              style={styles.delete_img}
              source={require("../img/list-check-3.png")}
            />
            <Text style={[styles.padding_right, styles.font_size_content]}>
              10
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.main]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.main]}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar />
      <View style={[styles.container]}>
        <Image
          style={styles.management_img}
          source={require("../img/server.png")}
        />
        <Text
          style={[styles.text_management, styles.fontSize_title, styles.color]}
        >
          Management Task
        </Text>
      </View>

      <View style={[styles.d_flex, styles.justify_between]}>
        <Text
          style={[
            styles.text_note,
            styles.fontSize_title,
            styles.color,
            styles.margin_vertical,
          ]}
        >
          Project
        </Text>
      </View>
      <Text
        style={[
          GenerateStyles.horizol_line_traight,
          GenerateStyles.marginVertical,
        ]}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          margin: 10,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
        placeholder="Find project"
        value={searchQuery}
        onChangeText={setSearchQuery} // Cập nhật trạng thái tìm kiếm
      />
      {projects.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "black" }}>No Projects.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          style={{ marginBottom: 310 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadTask} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ManageTask;
