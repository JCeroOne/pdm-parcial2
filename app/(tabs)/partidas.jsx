import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View, } from "react-native";
import MatchCard from "../components/matchCard";
import { api } from "../utils/api";

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PartidasScreen() {

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [infoMsg, setInfoMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        setInfoMsg(null)
        setErrorMsg(null)

        const res = await api.get("/matches/history", {
          params: { limit: 20, offset: 0 }
        })

        const backendMatches = res.data?.data || []

        const normalized = backendMatches.map((entry) => {
          const m = entry.match
          const p = entry.performance

          return {
            id: m.match_id,
            match_id: m.match_id,
            duration: formatDuration(m.duration_seconds),
            mode: m.game_mode,
            champion_id: p.champion_id,
            kills: p.kills,
            deaths: p.deaths,
            assists: p.assists,
            item_slots: p.items || [],
            trinket: p.trinket,
            win: p.win,
            cs: p.cs,
            vision_score: p.vision_score,
            kda: p.kda,
          };
        })

        setMatches(normalized)
      } catch (err) {
        if (err.response) {
          const status = err.response.status
          const msg = error.response.data?.msg

          if (status === 404 & msg && msg.includes("no tiene cuenta de Lol vinculada")) {
            setInfoMsg("Aún no tienes una cuenta de LoL vinculada.")
          } else if (status === 401) {
            setInfoMsg("Inicia sesión para ver tus partidas.");
          } else {
            setErrorMsg("Error al cargar tus partidas. Intenta de nuevo.");
          }
        } else {
          setErrorMsg("Error de conexión con el servidor.");
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Cargando partidas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {infoMsg && <Text style={styles.infoText}>{infoMsg}</Text>}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {matches.length === 0 && !infoMsg && !errorMsg && (
        <Text style={styles.infoText}>No se encontraron partidas.</Text>
      )}

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
});
