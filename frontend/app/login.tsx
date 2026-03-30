import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Giriş başarılı 🚀");

        // 👉 BAŞARILI GİRİŞ → ANA SAYFA
        router.replace("/(tabs)");
      } else {
        alert(data.message || "Hatalı giriş ❌");
      }
    } catch (error) {
      console.log(error);
      alert("Sunucuya bağlanılamadı ❌");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoş Geldin 👋</Text>
      <Text style={styles.subtitle}>Hesabına giriş yap</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        placeholder="Şifre"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 30
  },
  input: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff"
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});