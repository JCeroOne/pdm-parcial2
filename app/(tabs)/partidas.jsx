import { useEffect, useState } from "react";
import { ActivityIndicator, Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MatchCard from "../components/matchCard";
import { api } from "../utils/api";

import { useRouter } from "expo-router";

const PAGE_SIZE = 20
const MAX_MATCHES = 100
const SYNC_COOLDOWN_MS = 60000

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function dateKeyFromTsLocal(tsMs) {
  if (!tsMs) return null
  const d = new Date(tsMs)
  if (isNaN(d.getTime())) return null
  const locale = d.toLocaleDateString("es-MX", {
    timeZone: "America/Mexico_City",
  })
  const [day, month, year] = locale.split("/")
  const mm = month.padStart(2, "0")
  const dd = day.padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

function formatSectionTitle(dateKey) {
  const [year, month, day] = dateKey.split("-")
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
  const idx = parseInt(month, 10) - 1
  return `${day} ${months[idx]}`
}

function groupMatchesByDay(matches) {
  const groups = {}

  matches.forEach((match) => {
    const ts = match.game_start_ts
    const key = dateKeyFromTsLocal(ts)
    if (!key) return

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(match)
  })

  const sections = Object.keys(groups)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((dateKey) => ({
      title: dateKey,
      data: groups[dateKey],
    }))

  return sections
}

export default function PartidasScreen() {

  const router = useRouter();

  const [sections, setSections] = useState([])
  const [flatMatches, setFlatMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [infoMsg, setInfoMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [matchesErrorMsg, setMatchesErrorMsg] = useState(null)
  const [player, setPlayer] = useState(null)
  const [syncStatus, setSyncStatus] = useState("idle")
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const applyMatches = (allMatches) => {
    setFlatMatches(allMatches)
    const grouped = groupMatchesByDay(allMatches)
    setSections(grouped)
  }

  const fetchMatches = async (offsetValue = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setInfoMsg(null)
        setMatchesErrorMsg(null)
      }

      const res = await api.get("/matches/history", {
        params: { limit: PAGE_SIZE, offset: offsetValue },
      })

      const backendMatches = res.data?.data || []

      const pageNormalized = backendMatches.map((entry) => {
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
          game_start_ts: m.game_start_ts,
        }
      })

      const newFlat = append ? [...flatMatches, ...pageNormalized] : pageNormalized
      applyMatches(newFlat)

      const returned = res.data?.pagination?.returned ?? backendMatches.length
      const newOffset = offsetValue + returned
      setOffset(newOffset)

      if (returned < PAGE_SIZE || newOffset >= MAX_MATCHES) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

    } catch (err) {
      if (err.response) {
        const status = err.response.status
        const msgLower = (err.response.data?.msg || "").toLowerCase()

        if (status === 404 && msgLower.includes("no tiene cuenta de lol vinculada")) {
          setInfoMsg("Aún no tienes una cuenta de LoL vinculada.")
        } else if (status === 401) {
          setInfoMsg("Inicia sesión para ver tus partidas.")
        } else {
          setMatchesErrorMsg("Error al cargar tus partidas. Intenta de nuevo.")
        }
      } else {
        setMatchesErrorMsg("Error de conexión con el servidor.")
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return
    fetchMatches(offset, true)
  }

  const handleSync = async () => {
    if (syncStatus === "loading" || syncStatus === "cooldown") return

    try {
      setSyncStatus("loading");
      setInfoMsg(null);
      setMatchesErrorMsg(null);
      await api.post("/matches/sync", { count: 100 });
      setOffset(0);
      setHasMore(true);
      await fetchPlayer();
      await fetchMatches(0, false);
      setSyncStatus("cooldown");
      setTimeout(() => {
        setSyncStatus("idle");
      }, SYNC_COOLDOWN_MS);
    } catch (err) {
      if (err.response) {
        setMatchesErrorMsg("Error al sincronizar tus partidas. Intenta de nuevo.");
      } else {
        setMatchesErrorMsg("Error de conexión al sincronizar tus partidas.");
      }
      setSyncStatus("idle");
    }
  }

  const fetchPlayer = async () => {
    try {
      const res = await api.get("/players/me")
      setPlayer(res.data.data)
    } catch (err) {
      if (err.response) {
        const status = err.response.status
        const msgLower = (err.response.data?.msg || "").toLowerCase()

        if (status === 404) {
          if (msgLower.includes("no tiene cuenta de lol vinculada")) {
            setInfoMsg("Aún no tienes una cuenta de LoL vinculada.")
          } else if (msgLower.includes("datos del jugador no encontrados")) {
            setInfoMsg(
              "Tu cuenta está vinculada pero faltan datos del jugador. Sincroniza partidas."
            )
          } else if (msgLower.includes("usuario no encontrado")) {
            setErrorMsg("Tu sesión no es válida. Vuelve a iniciar sesión.")
          }
        } else if (status === 401) {
          setInfoMsg("Inicia sesión para ver tu perfil y partidas.")
        } else {
          setErrorMsg("Error al cargar tu perfil. Intenta de nuevo.")
        }
      } else {
        setErrorMsg("Error de conexión con el servidor.")
      }
    }
  }

  useEffect(() => {
    if (!api.defaults.headers.common["Authorization"]){
      router.navigate("/");
      return;
    }
    fetchPlayer()
    fetchMatches(0, false)
  }, [])

  if (loading && sections.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Cargando partidas...</Text>
      </View>
    )
  }

  const iconUrl = player
    ? `https://ddragon.leagueoflegends.com/cdn/15.22.1/img/profileicon/${player.player_icon}.png`
    : null

  const isSyncDisabled = syncStatus === "loading" || syncStatus === "cooldown"
  const syncLabel =
    syncStatus === "cooldown"
      ? "Actualizado"
      : syncStatus === "loading"
      ? "Actualizando..."
      : "Actualizar"

  const isUpToDate = syncStatus === "cooldown"

  return (
    <View style={styles.container}>
      {player && iconUrl && (
        <View style={styles.profileBar}>
          <Image source={{ uri: iconUrl }} style={styles.iconImg} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>
              {player.game_name}#{player.tagline}
            </Text>
            <Text style={styles.profileSub}>
              Nivel {player.player_level} • {player.platform}
            </Text>
          </View>
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
      )}

      {infoMsg && <Text style={styles.infoText}>{infoMsg}</Text>}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {matchesErrorMsg && sections.length === 0 && (
        <Text style={styles.errorText}>{matchesErrorMsg}</Text>
      )}

      {sections.length === 0 && !infoMsg && !errorMsg && !matchesErrorMsg && (
        <Text style={styles.infoText}>No se encontraron partidas.</Text>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>
            {formatSectionTitle(section.title)}
          </Text>
        )}
        stickySectionHeadersEnabled={false}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity
              onPress={handleLoadMore}
              disabled={loadingMore}
              style={styles.loadMoreButton}
            >
              <Text style={styles.loadMoreText}>
                {loadingMore ? "Cargando más..." : "Mostrar más"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    padding: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  iconImg: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#343434ff",
    borderRadius: 3,
    marginRight: 12,
  },
  profileTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  profileName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileSub: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
  },
  infoText: {
    color: "#fff",
    marginBottom: 8,
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 8,
  },
  sectionHeader: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginTop: 12,
    marginBottom: 6,
  },
  syncButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  syncButtonDisabled: {
    opacity: 0.7,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  syncDotYellow: {
    backgroundColor: "#facc15",
  },
  syncDotGreen: {
    backgroundColor: "#22c55e",
  },
  syncButtonText: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
  },
  loadMoreButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#111827",
  },
  loadMoreText: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "500",
  },
})
