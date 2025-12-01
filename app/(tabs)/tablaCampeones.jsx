import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { api } from "../utils/api";
import { getChampionIcon } from "../utils/dataDragon";

function getWRColor(wr) {
  if (wr >= 60) return "#a4ff79";
  if (wr >= 50) return "#58cfff";
  return "#ff7878";
}

function getKDAColor(kda) {
  if (kda >= 3) return "#a4ff79";
  if (kda >= 2) return "#58cfff";
  return "#ff7878";
}

export default function TablaCampeones() {
  const [champions, setChampions] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [infoMsg, setInfoMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // 🔄 Estados del botón de sincronización
  const [isSyncDisabled, setIsSyncDisabled] = useState(false);
  const [isUpToDate, setIsUpToDate] = useState(true);
  const [syncLabel, setSyncLabel] = useState("Actualizar");

  const fetchChampionStats = async () => {
    try {
      setLoading(true);
      setInfoMsg(null);
      setErrorMsg(null);

      const res = await api.get("/matches/history", {
        params: { limit: 100, offset: 0 }
      });

      const backendMatches = res.data?.data || [];

      if (backendMatches.length === 0) {
        setInfoMsg("No tienes partidas registradas aún.");
        setChampions([]);
        return;
      }

      const statsMap = {};
      let totalGames = 0;
      let totalWins = 0;
      let totalKills = 0;
      let totalDeaths = 0;
      let totalAssists = 0;
      let totalCS = 0;
      let totalDuration = 0;

      for (const entry of backendMatches) {
        const p = entry.performance;
        const m = entry.match;
        const champId = p.champion_id;

        totalGames += 1;
        if (p.win) totalWins += 1;
        totalKills += p.kills;
        totalDeaths += p.deaths;
        totalAssists += p.assists;
        totalCS += p.cs;
        totalDuration += m.duration_seconds;

        if (!statsMap[champId]) {
          statsMap[champId] = {
            champion_id: champId,
            games: 0,
            wins: 0,
            losses: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            cs: 0,
            duration: 0,
          };
        }

        const stat = statsMap[champId];
        stat.games += 1;
        if (p.win) stat.wins += 1;
        else stat.losses += 1;

        stat.kills += p.kills;
        stat.deaths += p.deaths;
        stat.assists += p.assists;
        stat.cs += p.cs;
        stat.duration += m.duration_seconds;
      }

      const totalKDA = totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths) : (totalKills + totalAssists);
      const avgCSPerMin = totalDuration > 0 ? (totalCS / (totalDuration / 60)) : 0;

      const calculatedTotals = {
        games: totalGames,
        winrate: Math.round((totalWins / totalGames) * 100),
        wins: totalWins,
        losses: totalGames - totalWins,
        kda: totalKDA.toFixed(1),
        kills: (totalKills / totalGames).toFixed(1),
        deaths: (totalDeaths / totalGames).toFixed(1),
        assists: (totalAssists / totalGames).toFixed(1),
        csPerMin: avgCSPerMin.toFixed(1),
      };

      const championArray = await Promise.all(
        Object.values(statsMap).map(async (stat) => {
          const iconUrl = await getChampionIcon(stat.champion_id);
          const kda = stat.deaths > 0 ? ((stat.kills + stat.assists) / stat.deaths) : (stat.kills + stat.assists);
          const csPerMin = stat.duration > 0 ? (stat.cs / (stat.duration / 60)) : 0;

          return {
            id: stat.champion_id,
            name: iconUrl ? iconUrl.split('/').pop().replace('.png', '') : 'Unknown',
            icon: iconUrl,
            games: stat.games,
            winrate: Math.round((stat.wins / stat.games) * 100),
            wins: stat.wins,
            losses: stat.losses,
            kda: kda.toFixed(1),
            kills: (stat.kills / stat.games).toFixed(1),
            deaths: (stat.deaths / stat.games).toFixed(1),
            assists: (stat.assists / stat.games).toFixed(1),
            csPerMin: csPerMin.toFixed(1),
          };
        })
      );

      championArray.sort((a, b) => b.games - a.games);

      setTotals(calculatedTotals);
      setChampions(championArray);

    } catch (err) {
      setErrorMsg("Error al cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampionStats();
  }, []);

  // 🔄 BOTÓN: Recargar stats
  const handleSync = async () => {
    if (isSyncDisabled) return;

    setIsSyncDisabled(true);
    setSyncLabel("Syncing…");
    setIsUpToDate(false);

    try {
      await fetchChampionStats();
      setSyncLabel("Up to date");
      setIsUpToDate(true);
    } catch {
      setSyncLabel("Retry");
      setIsUpToDate(false);
    }

    setIsSyncDisabled(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#58cfff" />
        <Text style={styles.infoText}>Cargando estadísticas...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {infoMsg && <Text style={styles.infoText}>{infoMsg}</Text>}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {/* 🔥 FILA HEADER + BOTÓN */}
      <View style={styles.headerRow}>
        <Text style={styles.headerLeft}>SEASON 15 STATS</Text>

        <TouchableOpacity
          style={[styles.syncButton, isSyncDisabled && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncDisabled}
        >
          <View
            style={[
              styles.syncDot,
              isUpToDate ? styles.syncDotGreen : styles.syncDotYellow,
            ]}
          />
          <Text style={styles.syncButtonText}>{syncLabel}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>

            {/* HEADER */}
            <View style={[styles.row, styles.tableHeader]}>
              <Text style={[styles.colChampion, styles.headerText]}>Champion</Text>
              <Text style={[styles.colGames, styles.headerText]}>Games</Text>
              <Text style={[styles.colWR, styles.headerText]}>WR</Text>
              <Text style={[styles.colKDA, styles.headerText]}>KDA</Text>
              <Text style={[styles.colKDA2, styles.headerText]}>K/D/A</Text>
              <Text style={[styles.colCS, styles.headerText]}>CS/m</Text>
            </View>

            {/* TOTAL ROW */}
            {totals && (
              <View style={[styles.row, styles.totalRow]}>
                <View style={styles.championInfo}>
                  <Text style={styles.championName}>All Champions</Text>
                </View>

                <Text style={[styles.colGames, styles.text]}>{totals.games}</Text>

                <View style={styles.colWR}>
                  <Text style={[styles.text, { color: getWRColor(totals.winrate), fontWeight: "600" }]}>
                    {totals.winrate}%
                  </Text>
                  <Text style={styles.subText}>{totals.wins}W - {totals.losses}L</Text>
                </View>

                <Text style={[styles.colKDA, styles.text]}>{totals.kda}</Text>

                <Text style={[styles.colKDA2, styles.text]}>
                  {totals.kills} / {totals.deaths} / {totals.assists}
                </Text>

                <Text style={[styles.colCS, styles.text]}>{totals.csPerMin}</Text>
              </View>
            )}

            {/* ROWS */}
            <FlatList
              data={champions}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View style={styles.championInfo}>
                    {item.icon ? (
                      <Image source={{ uri: item.icon }} style={styles.icon} />
                    ) : (
                      <View style={[styles.icon, { backgroundColor: '#333' }]} />
                    )}

                    <Text style={styles.championName}>{item.name}</Text>
                  </View>

                  <Text style={[styles.colGames, styles.text]}>{item.games}</Text>

                  <View style={styles.colWR}>
                    <Text style={[styles.text, { color: getWRColor(item.winrate), fontWeight: "600" }]}>
                      {item.winrate}%
                    </Text>
                    <Text style={styles.subText}>{item.wins}W - {item.losses}L</Text>
                  </View>

                  <Text style={[styles.colKDA, styles.text, { color: getKDAColor(parseFloat(item.kda)) }]}>
                    {item.kda}
                  </Text>

                  <Text style={[styles.colKDA2, styles.text]}>
                    {item.kills} / {item.deaths} / {item.assists}
                  </Text>

                  <Text style={[styles.colCS, styles.text]}>{item.csPerMin}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    paddingTop: 40,
    paddingHorizontal: 15,
  },

  centered: {
    flex: 1,
    backgroundColor: "#0b0d12",
    justifyContent: "center",
    alignItems: "center",
  },

  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },

  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },

  /* 🔥 NUEVO: Header + botón */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    color: "#d1d1d1",
    fontSize: 16,
    fontWeight: "600",
  },

  /* 🔥 Estilo del botón que pediste */
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d2d2d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  syncButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
  },

  syncDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  syncDotGreen: {
    backgroundColor: "#2ecc71",
  },
  syncDotYellow: {
    backgroundColor: "#f1c40f",
  },

  /* TABLA */
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "#1a1f3a",
    backgroundColor: "#12141b",
  },

  headerText: {
    color: "#787878",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  row: {
    backgroundColor: "#12141b",
    marginVertical: 3,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  totalRow: {
    backgroundColor: "#1a1f3a",
    borderWidth: 1,
    borderColor: "#2a3f5a",
    marginBottom: 10,
  },

  championInfo: {
    width: 180,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },

  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
  },

  championName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },

  text: {
    color: "#d1d1d1",
    textAlign: "center",
    fontSize: 14,
  },

  subText: {
    color: "#787878",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },

  colGames: { width: 70, textAlign: "center" },
  colWR: { width: 90, alignItems: "center" },
  colKDA: { width: 70, textAlign: "center" },
  colKDA2: { width: 110, textAlign: "center" },
  colCS: { width: 70, textAlign: "center" },
  colChampion: { width: 180 },

});
