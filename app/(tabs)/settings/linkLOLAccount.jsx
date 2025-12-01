import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import { api } from '../../utils/api.js';

function Icon(props) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}

export default function LinkLOLAccScreen(){

    const router = useRouter();

    const [player, setPlayer] = useState("");
    const [tag, setTag] = useState("");
    const [region, setRegion] = useState("");
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");

    async function linkAccount(){
        if(player.trim() == "" || tag.trim() == "" || region.trim() == ""){
            setError("No se proporcionaron los datos requeridos.");
            setTimeout(() => setError(""), 5000);
            return;
        }

        setProcessing(true);
        try {
            const res = await api.post("/players/link", {game_name: player, tag, platform: region});
            await api.post("/matches/sync", {game_name: player, tag, platform: region});
            alert("Cuenta vinculada con éxito");
            setProcessing(false);
            router.navigate("/(tabs)/usuario");
        } catch(e){
            if(e.response){
                const status = e.response.status;
                if(status == 404) setError("No se encontró la cuenta de LoL");
                else if(status == 401) setError("Llave de API de Riot inválida");
                else setError("Ocurrió un error interno. Intenta de nuevo más tarde.");
                setTimeout(() => setError(""), 5000);
                console.error(e);
            } else {
                setError("Ocurrió un error interno. Intenta de nuevo más tarde.");
				setTimeout(() => setError(""), 5000);
				console.error(e);
            }
            setProcessing(false);
        }
    }

    return (<View style={styles.container}>
        {error.trim() == "" ? "" : <View style={styles.error}>
            <Text style={styles.errorTxt}>{error}</Text>
        </View>}
        <Text style={styles.label}>Nombre</Text>
        <TextInput 
            style={styles.input}
            placeholder="testuser01"
            onChangeText={value => setPlayer(value)}
        />
        <Text style={styles.label}>Tag</Text>
        <TextInput 
            style={styles.input}
            placeholder="LAN"
            onChangeText={value => setTag(value)}
        />
        <Text style={styles.label}>Región</Text>
        <TextInput 
            style={styles.input}
            placeholder="LAN"
            onChangeText={value => setRegion(value)}
        />
        <TouchableOpacity style={styles.btn} onPress={() => linkAccount()}>
            {processing ? 
                <ActivityIndicator size="small" /> :
                <Text style={styles.btnTxt}><Icon name="link" size="18" /> Vincular</Text>
            }
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGray]} onPress={() => router.navigate("/(tabs)/usuario")}>
            <Text style={styles.btnTxt}>Cancelar</Text>
        </TouchableOpacity>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16
    },
    label: {
	color: "#fff",
	fontWeight: "bold",
	fontSize: 18,
	marginBottom: 3
  },
  input: {
	backgroundColor: "#555",
	color: "#fff",
	fontSize: 18,
	borderWidth: 2,
	borderColor: "#aaa",
	borderRadius: 10,
	paddingHorizontal: 10,
	marginBottom: 10
  },
  btn: {
	display: "block",
	backgroundColor: "#00f",
	padding: 10,
	borderRadius: 10,
    marginVertical: 10
  },
  btnGray: {
	display: "block",
	backgroundColor: "#333",
	padding: 10,
	borderRadius: 10
  },
  btnTxt: {
	color: "#fff",
	fontWeight: "bold",
	fontSize: 18,
	textAlign: "center"
  },
  error: {
    backgroundColor: "rgba(255, 0, 0, 0.33)",
    padding: 10,
    marginVertical: 10,
    paddingHorizontal: 20,
    boxSizing: "border-box",
    borderRadius: 10,
    transitionDuration: 0.25
  },
  errorTxt: {
    fontSize: 16,
    textAlign: "justify",
    fontWeight: "bold",
    color: "#fff"
  }
});