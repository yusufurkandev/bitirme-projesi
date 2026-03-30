import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
  const { data } = useLocalSearchParams();

  const parsed = JSON.parse(data as string);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Önerilen Rota 🚀</Text>

      {parsed.route.map((item: any, index: number) => (
        <View key={index} style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.info}>
            ⏱ {item.duration} dk
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#0f172a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    color: "#94a3b8",
    marginTop: 5,
  },
});