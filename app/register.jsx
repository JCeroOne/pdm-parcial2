import { useState } from 'react';

import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

import { useRouter } from 'expo-router';

import { api, setAuthToken } from "../app/utils/api.js";

export default function TabOneScreen() {

		const router = useRouter();

		const [username, setUsername] = useState("");
		const [password, setPassword] = useState("");
		const [confirmPwd, setConfirmPwd] = useState("");
		const [error, setError] = useState("");
		const [processing, setProcessing] = useState(false);

		async function register(){
			if(username.trim() == "" || password.trim() == "" || confirmPwd.trim() == ""){
				setError("No se proporcionaron todos los datos necesarios.");
				setTimeout(() => setError(""), 5000);
				return;
			}
			if(password != confirmPwd){
				setError("Las contraseñas no coinciden.");
				setTimeout(() => setError(""), 5000);
				return;
			}

			setProcessing(true);
			try {
				const res = await api.post("/user/create", {username, password});
				console.log(res.data);
				setAuthToken(res.data.access_token);
				setProcessing(false);
				alert("Usuario creado exitosamente");
				router.navigate("/");
			} catch(e){
				if(e.response){
					const status = e.response.status;
					if(status == 409) setError("El nombre de usuario está ocupado.");
					else if(status == 400) setError("Los datos proporcionados no son válidos.");
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
				{error.trim() == "" ? "" : <View style={styles.error}>
					<Text style={styles.errorTxt}>{error}</Text>
				</View>}
				<Text style={styles.label}>Nombre de usuario</Text>
				<TextInput style={styles.input} placeholder="Usuario1"
					onChangeText={value => setUsername(value)} />
				<Text style={styles.label}>Contraseña</Text>
				<TextInput style={styles.input} placeholder="Contraseña1" secureTextEntry={true}
					onChangeText={value => setPassword(value)} />
				<Text style={styles.label}>Confirmar contraseña</Text>
				<TextInput style={styles.input} placeholder="Contraseña1" secureTextEntry={true}
					onChangeText={value => setConfirmPwd(value)} />
				<TouchableOpacity style={styles.loginBtn}>
					{processing ? 
						<ActivityIndicator size="small" /> :
						<Text style={styles.loginBtnTxt} onPress={() => register()}>Registrarse</Text>
					}
				</TouchableOpacity>
			</View>
		</>);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30,
        paddingVertical: 30
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
