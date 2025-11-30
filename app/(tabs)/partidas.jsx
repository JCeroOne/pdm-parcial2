import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, } from "react-native";
import MatchCard from "../components/matchCard";
import { api } from "../utils/api";

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PartidasScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMsg, setInfoMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await api.get("/players/me")
        setPlayer(res.data.data);
      } catch (err) {
        if (err.response) {
          const status = err.response.status
          const msgLower = (err.response.data?.msg || "").toLowerCase()

          if (status === 404) {
            if (msgLower.includes("no tiene cuenta de lol vinculada")) {
              setInfoMsg("Aún no tienes una cuenta de LoL vinculada.");
            } else if (msgLower.includes("datos del jugador no encontrados")) {
              setInfoMsg(
                "Tu cuenta está vinculada pero faltan datos del jugador. Sincroniza partidas."
              );
            } else if (msgLower.includes("usuario no encontrado")) {
              setErrorMsg("Tu sesión no es válida. Vuelve a iniciar sesión.");
            }
          } else if (status === 401) {
            setInfoMsg("Inicia sesión para ver tu perfil y partidas.");
          } else {
            setErrorMsg("Error al cargar tu perfil. Intenta de nuevo.");
          }
        } else {
          setErrorMsg("Error de conexión con el servidor.");
        }
      }
    };

    const fetchMatches = async () => {
      try {
        setLoading(true);
        setInfoMsg(null);
        setErrorMsg(null);

        const res = await api.get("/matches/history", {
          params: { limit: 20, offset: 0 },
        })

        const backendMatches = res.data?.data || []

        const normalized = backendMatches.map((entry) => {
          const m = entry.match;
          const p = entry.performance;

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
          }
        })

        setMatches(normalized)

      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const msgLower = (err.response.data?.msg || "").toLowerCase()

          if (status === 404 && msgLower.includes("no tiene cuenta de lol vinculada")) {
            setInfoMsg("Aún no tienes una cuenta de LoL vinculada.")
          } else if (status === 401) {
            setInfoMsg("Inicia sesión para ver tus partidas.")
          } else {
            setErrorMsg("Error al cargar tus partidas. Intenta de nuevo.")
          }
        } else {
          setErrorMsg("Error de conexión con el servidor.")
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer()
    fetchMatches()
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Cargando partidas...</Text>
      </View>
    );
  }

  const iconUrl = player
    ? `https://ddragon.leagueoflegends.com/cdn/15.22.1/img/profileicon/${player.player_icon}.png`
    : null;

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
        </View>
      )}

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
    backgroundColor: "#000",
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
    backgroundColor: "#111111ff",          //#15224fff me gustaba
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
})
