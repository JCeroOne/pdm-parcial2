import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

import { useRouter } from 'expo-router';

export default function TabOneScreen() {

		const router = useRouter();

		return (<>
				<View style={styles.container}>
					<Text style={styles.heading}>Bienvenido</Text>
					<Text style={styles.note}>Inicia sesión para continuar</Text>
					<Text style={styles.label}>Nombre de usuario</Text>
					<TextInput style={styles.input} placeholder="Usuario1" />
					<Text style={styles.label}>Contraseña</Text>
					<TextInput style={styles.input} placeholder="Contraseña1" secureTextEntry={true} />
					<TouchableOpacity style={styles.loginBtn}>
						<Text style={styles.loginBtnTxt} onPress={() => router.push("/(tabs)/partidas")}>Iniciar sesión</Text>
					</TouchableOpacity>
					<Text style={[styles.note, {marginTop: 15}]}>¿No tienes cuenta?</Text>
					<TouchableOpacity style={styles.btn}>
						<Text style={styles.btnTxt} onPress={() => router.navigate("/register")}>Registrarse</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.notice}>
					<Text style={styles.noticeTxt}>Dado que aún no se han implementado las sesiones, símplemente presiona "Iniciar sesión" para acceder.</Text>
				</View>
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
	notice: {
		position: "absolute",
		top: 50,
		left: "50%",
		transform: "translate(-50%, 0)",
		width: "90%",
		backgroundColor: "#fa05",
		padding: 10,
		paddingHorizontal: 20,
		boxSizing: "border-box",
		borderRadius: 10
	},
	noticeTxt: {
		fontSize: 16,
		textAlign: "justify",
		fontWeight: "bold"
	}
});
