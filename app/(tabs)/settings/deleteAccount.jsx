import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import { api, setAuthToken } from '../../utils/api.js';

function Icon(props) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}

export default function DeleteAccScreen(){

    const router = useRouter();

    const [pwd, setPwd] = useState("");
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");

    async function deleteAccount(){
        if(pwd.trim() == ""){
            setError("Debes escribir tu contraseña.");
            setTimeout(() => setError(""), 5000);
            return;
        }

        setProcessing(true);
        try {
            await api.delete("/user/delete", {
                headers: {"Content-Type": "application/json"},
                data: {password: pwd}
            });
            setAuthToken();
            alert("Cuenta eliminada exitosamente");
            setProcessing(false);
            router.navigate("/");
        } catch(e){
            if(e.response){
                const status = e.response.status;
                if(status == 404) setError("Sesión inválida. Vuelve a iniciar sesión.");
                else if(status == 401) setError("Contraseña incorrecta");
                else setError("Ocurrió un error interno. Intenta de nuevo más tarde.");
                setTimeout(() => setError(""), 5000);
            } else {
                setError("Ocurrió un error interno. Intenta de nuevo más tarde.");
                setTimeout(() => setError(""), 5000);
            }
            setProcessing(false);
        }
    }

    return (<View style={styles.container}>
        {error.trim() == "" ? "" : <View style={styles.error}>
            <Text style={styles.errorTxt}>{error}</Text>
        </View>}
        <Text style={styles.heading}>¿Estás seguro?</Text>
        <Text style={styles.note}>Esta acción es irreversible</Text>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput 
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => setPwd(value)}
        />
        <TouchableOpacity style={[styles.btn]} onPress={() => deleteAccount()}>
            {processing ? 
                <ActivityIndicator size="small" /> :
                <Text style={styles.btnTxt}><Icon name="trash" size="18" /> Eliminar cuenta</Text>
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
    heading: {
        color: "#fff",
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: "center"
	},
	note: {
        color: "#fff",
		textAlign: "center",
		fontSize: 18,
        marginBottom: 20
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
    backgroundColor: "#a00",
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