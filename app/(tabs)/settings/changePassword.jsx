import FontAwesome from '@expo/vector-icons/FontAwesome';

import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import { api } from '../../utils/api.js';

function Icon(props) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}

export default function ChangePwdScreen(){

    const router = useRouter();

    const [pwd, setPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmNewPwd, setConfirmNewPwd] = useState("");
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");

    async function changePwd(){
        if(pwd.trim() == "" || newPwd.trim() == "" || confirmNewPwd.trim() == ""){
            setError("No se proporcionaron los datos requeridos.");
            setTimeout(() => setError(""), 5000);
            return;
        }
        if(newPwd != confirmNewPwd){
            setError("Las contraseñas no coinciden.");
            setTimeout(() => setError(""), 5000);
            return;
        }

        setProcessing(true);
        try {
            const res = await api.put("/user/edit/pwd", {password: pwd, new_password: newPwd});
            alert("Contraseña actualizada");
            router.navigate("/(tabs)/usuario");
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
				console.error(e);
            }
            setProcessing(false);
        }
    }

    return (<View style={styles.container}>
        {error.trim() == "" ? "" : <View style={styles.error}>
            <Text style={styles.errorTxt}>{error}</Text>
        </View>}
        <Text style={styles.label}>Contraseña actual</Text>
        <TextInput 
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => setPwd(value)}
        />
        <Text style={styles.label}>Contraseña nueva</Text>
        <TextInput 
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => setNewPwd(value)}
        />
        <Text style={styles.label}>Confirmar contraseña nueva</Text>
        <TextInput 
            style={styles.input}
            secureTextEntry={true}
            onChangeText={value => setConfirmNewPwd(value)}
        />
        <TouchableOpacity style={styles.btn} onPress={() => changePwd()}>
            {processing ? 
                <ActivityIndicator size="small" /> :
                <Text style={styles.btnTxt}><Icon name="check" size="18" /> Confirmar</Text>
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