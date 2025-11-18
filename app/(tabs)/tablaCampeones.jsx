import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { champions } from "../../data/champions";

// Función helper fuera del StyleSheet
const getWRColor = wr => {
  if (wr >= 60) return "#a4ff79";
  if (wr >= 50) return "#58cfff";
  return "#ff7878";
};

export default function TablaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>SEASON 15 STATS</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.colChampion, styles.headerText]}>Campeón</Text>
        <Text style={[styles.colGames, styles.headerText]}>Partidas</Text>
        <Text style={[styles.colWR, styles.headerText]}>WR</Text>
        <Text style={[styles.colKDA, styles.headerText]}>KDA</Text>
      </View>

      <FlatList
        data={champions}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.championInfo}>
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.championName}>{item.name}</Text>
            </View>

            <Text style={[styles.games, styles.text]}>{item.games}</Text>

            <Text style={[styles.wr, styles.text, { color: getWRColor(item.winrate) }]}>
              {item.winrate}%
            </Text>

            <Text style={[styles.kda, styles.text]}>{item.kda}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    paddingTop: 40,
    paddingHorizontal: 15,
  },

  header: {
    color: "#d1d1d1",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 15,
  },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    marginBottom: 5,
  },

  headerText: {
    color: "#787878",
    fontSize: 14,
    fontWeight: "600",
  },

  colChampion: { flex: 2 },
  colGames: { flex: 1, textAlign: "center" },
  colWR: { flex: 1, textAlign: "center" },
  colKDA: { flex: 1, textAlign: "center" },

  row: {
    backgroundColor: "#12141b",
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  championInfo: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 10,
  },

  championName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  text: {
    color: "#d1d1d1",
    textAlign: "center",
  },

  games: { flex: 1 },
  wr: { flex: 1, textAlign: "center" },
  kda: { flex: 1, textAlign: "center" },
});