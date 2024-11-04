import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import Generate from "../CSS/Generate";
import { login } from "../api/authService";

const Login = ({ navigation }) => {
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAsyn, setisAsyn] = useState(false);
  const loadData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedRole = await AsyncStorage.getItem("userRole");
      const storedPassword = await AsyncStorage.getItem("userPassword");

      console.log("Stored Email:", storedEmail); // Kiểm tra email
      console.log("Stored Role:", storedRole); // Kiểm tra role
      console.log("Stored Password:", storedPassword); // Kiểm tra password

      if (storedEmail !== null) setEmail(storedEmail);
      if (storedRole !== null) setRole(storedRole);
      if (storedPassword !== null) setPassword(storedPassword);
      setisAsyn(true);
    } catch (error) {
      console.log("Error fetching data from AsyncStorage", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // useEffect để tự động đăng nhập khi có đủ thông tin
  useEffect(() => {
    if (isAsyn) {
      handleLogin(); // Gọi hàm đăng nhập
    }
  }, [isAsyn]); // Chạy khi các giá trị thay đổi

  const handleLogin = async () => {
    setIsLoading(true);

    // Kiểm tra các giá trị trước khi gọi API
    if (!email || !role || !password) {
      setErrorVisible(true);
      console.log("Email, role, and password must be provided");
      setIsLoading(false);
      return; // Dừng lại nếu thiếu thông tin
    }

    try {
      const { userData, userRole } = await login(role, email, password);
      if (userRole === "manager") {
        navigation.navigate("Manager", {
          name: "Manager",
          data: userData,
          success: "success",
        });
      } else if (userRole === "leader") {
        navigation.navigate("Leader", {
          name: "Leader",
          data: userData,
          success: "success",
        });
      } else if (userRole === "member") {
        navigation.navigate("Member", {
          name: "Member",
          data: userData,
          success: "success",
        });
      }
    } catch (error) {
      setErrorVisible(true);
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrorVisible(false);
  };

  const renderLoading = () => {
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Dialog.Container visible={errorVisible}>
        <Dialog.Title style={{ color: "red" }}>Error</Dialog.Title>
        <Dialog.Description style={{ color: "black" }}>
          Invalid role or password
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={handleClose} />
      </Dialog.Container>

      <RNPickerSelect
        onValueChange={(value) => setRole(value)}
        items={[
          { label: "Member", value: "member" },
          { label: "Leader", value: "leader" },
          { label: "Manager", value: "manager" },
        ]}
        value={role}
        style={pickerSelectStyles}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <View style={[Generate.d_flex_align_center]}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#000"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 24,
    width: "90%",
  },
  eyeIcon: {
    marginLeft: 10,
    marginBottom: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 24,
    fontSize: 16,
  },
});

export default Login;
