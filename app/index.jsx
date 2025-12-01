import { useState } from 'react';

import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

import { useRouter } from 'expo-router';

import { api, setAuthToken } from "@/app/utils/api.js";

export default function TabOneScreen() {

		const router = useRouter();

		const [username, setUsername] = useState("");
		const [password, setPassword] = useState("");
		const [error, setError] = useState("");
		const [processing, setProcessing] = useState(false);

		async function login(){
			if(username.trim() == "" || password.trim() == ""){
				setError("No se proporcionó nombre de usuario y/o contraseña.");
				setTimeout(() => setError(""), 5000);
				return;
			};
			
			setProcessing(true);
			try {
				const res = await api.post("/login", {username, password});
				setAuthToken(res.data.access_token);
				router.push("/(tabs)/partidas");
			} catch(e){
				if(e.response){
					const status = e.response.status;
					if(status == 401) setError("El nombre de usuario y/o la contraseña no son válidos.");
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

		return (<>
			<View style={styles.container}>
				<Text style={styles.heading}>Bienvenido</Text>
				<Text style={styles.note}>Inicia sesión para continuar</Text>
				<Text style={styles.label}>Nombre de usuario</Text>
				<TextInput style={styles.input} placeholder="Usuario1"
					onChangeText={value => setUsername(value)} />
				<Text style={styles.label}>Contraseña</Text>
				<TextInput style={styles.input} placeholder="Contraseña1" secureTextEntry={true} 
					onChangeText={value => setPassword(value)} />
				<TouchableOpacity style={styles.loginBtn}>
					{processing ?
						<ActivityIndicator size="small" /> :
						<Text style={styles.loginBtnTxt} onPress={() => login(username, password)}>Iniciar sesión</Text>
					}
				</TouchableOpacity>
				<Text style={[styles.note, {marginTop: 15}]}>¿No tienes cuenta?</Text>
				<TouchableOpacity style={styles.btn}>
					<Text style={styles.btnTxt} onPress={() => router.navigate("/register")}>Registrarse</Text>
				</TouchableOpacity>
			</View>
			{error.trim() == "" ? "" : <View style={styles.error}>
				<Text style={styles.errorTxt}>{error}</Text>
			</View>}
		</>);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 30
	},
	heading: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: "center"
	},
	note: {
		textAlign: "center",
		fontSize: 18,
	},
	input: {
		backgroundColor: "#555",
		color: "#fff",
		fontSize: 18,
		borderWidth: 2,
		borderColor: "#aaa",
		borderRadius: 10,
		paddingHorizontal: 10,
		marginBottom: 10,
		width: "100%"
	},
	btn: {
		backgroundColor: "#0a0",
		padding: 10,
		borderRadius: 10,
		marginVertical: 10
	},
	btnTxt: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
		textAlign: "center"
	},
	label: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
		marginTop: 10,
		marginBottom: 3
	},
	loginBtn: {
		display: "block",
		backgroundColor: "#00f",
		padding: 10,
		borderRadius: 10,
		marginTop: 10
	},
	loginBtnTxt: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
		textAlign: "center"
	},
	error: {
		position: "absolute",
		top: 50,
		left: "50%",
		transform: "translate(-50%, 0)",
		width: "90%",
		backgroundColor: "rgba(255, 0, 0, 0.33)",
		padding: 10,
		paddingHorizontal: 20,
		boxSizing: "border-box",
		borderRadius: 10,
		transitionDuration: 0.25
	},
	errorTxt: {
		fontSize: 16,
		textAlign: "justify",
		fontWeight: "bold"
	}
});
