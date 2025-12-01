import React, { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native"
import { api } from "../utils/api"
import { getChampionIcon } from "../utils/dataDragon"

const getWRColor = wr => {
  if (wr >= 60) return "#a4ff79"
  if (wr >= 50) return "#58cfff"
  return "#ff7878"
}

let championNameMap = null

async function loadChampionNames() {
  if (championNameMap) return championNameMap
  try {
    const version = "15.22.1"
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    const res = await fetch(url)
    const json = await res.json()
    const data = json.data || {}
    const map = {}
    Object.values(data).forEach(champ => {
      map[champ.key] = champ.name
    })
    championNameMap = map
    return championNameMap
  } catch (e) {
    championNameMap = {}
    return championNameMap
  }
}

export default function TablaScreen() {
  const [champions, setChampions] = useState([])
  const [loading, setLoading] = useState(true)
  const [infoMsg, setInfoMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    fetchChampionStats()
  }, [])

  const fetchChampionStats = async () => {
    try {
      setLoading(true)
      setInfoMsg(null)
      setErrorMsg(null)

      const res = await api.get("/matches/history", {
        params: { limit: 100, offset: 0 },
      })

      const backendMatches = res.data?.data || []

      if (backendMatches.length === 0) {
        setInfoMsg("No tienes partidas registradas aún.")
        setChampions([])
        return
      }

      const statsMap = {}

      for (const entry of backendMatches) {
        const p = entry.performance
        const champId = p.champion_id

        if (!statsMap[champId]) {
          statsMap[champId] = {
            champion_id: champId,
            games: 0,
            wins: 0,
            total_kda: 0,
          }
        }

        statsMap[champId].games += 1
        if (p.win) statsMap[champId].wins += 1
        statsMap[champId].total_kda += p.kda
      }

      const championNames = await loadChampionNames()

      const championArray = await Promise.all(
        Object.values(statsMap).map(async stat => {
          const iconUrl = await getChampionIcon(stat.champion_id)
          const displayName =
            championNames[stat.champion_id.toString()] || "Unknown"

          return {
            id: stat.champion_id,
            name: displayName,
            icon: iconUrl,
            games: stat.games,
            winrate: Math.round((stat.wins / stat.games) * 100),
            kda: (stat.total_kda / stat.games).toFixed(1),
          }
        })
      )

      championArray.sort((a, b) => b.games - a.games)

      setChampions(championArray)

    } catch (err) {
      if (err.response) {
        const status = err.response.status
        const msg = err.response.data?.msg

        if (status === 404 && msg && msg.includes("no tiene cuenta de Lol vinculada")) {
          setInfoMsg("Aún no tienes una cuenta de LoL vinculada.")
        } else if (status === 401) {
          setInfoMsg("Inicia sesión para ver tus estadísticas.")
        } else {
          setErrorMsg("Error al cargar las estadísticas. Intenta de nuevo.")
        }
      } else {
        setErrorMsg("Error de conexión con el servidor.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#58cfff" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {infoMsg && <Text style={styles.infoText}>{infoMsg}</Text>}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {champions.length === 0 && !infoMsg && !errorMsg && (
        <Text style={styles.infoText}>No se encontraron estadísticas.</Text>
      )}

      {champions.length > 0 && (
        <>
          <Text style={styles.header}>SEASON 15 STATS</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.colChampion, styles.headerText]}>Campeón</Text>
            <Text style={[styles.colGames, styles.headerText]}>Partidas</Text>
            <Text style={[styles.colWR, styles.headerText]}>WR</Text>
            <Text style={[styles.colKDA, styles.headerText]}>KDA</Text>
          </View>

          <FlatList
            data={champions}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.championInfo}>
                  {item.icon ? (
                    <Image source={{ uri: item.icon }} style={styles.icon} />
                  ) : (
                    <View style={[styles.icon, { backgroundColor: "#333" }]} />
                  )}
                  <Text style={styles.championName}>{item.name}</Text>
                </View>

                <Text style={[styles.games, styles.text]}>{item.games}</Text>

                <Text
                  style={[
                    styles.wr,
                    styles.text,
                    { color: getWRColor(item.winrate) },
                  ]}
                >
                  {item.winrate}%
                </Text>

                <Text style={[styles.kda, styles.text]}>{item.kda}</Text>
              </View>
            )}
          />
        </>
      )}
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

  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
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
})
