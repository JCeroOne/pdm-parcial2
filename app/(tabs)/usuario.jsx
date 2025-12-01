import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

function Icon(props) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}

export default function Usuario() {

	const router = useRouter();

	const [showPwdChange, setShowPwdChange] = useState(false);

	const [playerName, setPlayerName] = useState("");
	const [playerTag, setPlayerTag] = useState("");
	const [playerRegion, setPlayerRegion] = useState("");

	return(<>
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Cuenta</Text>
			<TouchableOpacity style={styles.btn} onPress={() => router.push("/settings/changePassword")}>
				<Text style={styles.btnTxt}>Cambiar contraseña <Icon name="angle-right" size="18" /></Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => router.navigate("/")}>
				<Text style={styles.btnTxt}>Cerrar sesión <Icon name="angle-right" size="18" /></Text>
			</TouchableOpacity>
			<Text style={styles.sectionHeader}>Datos de jugador</Text>
			<Text style={styles.label}>Nombre</Text>
			<TextInput 
				style={styles.input}
				placeholder="testuser01"
			/>
			<Text style={styles.label}>Tag</Text>
			<TextInput 
				style={styles.input}
				placeholder="#LAN"
			/>
			<Text style={styles.label}>Región</Text>
			<TextInput 
				style={styles.input}
				placeholder="LAN"
			/>
			<TouchableOpacity style={styles.saveBtn} onPress={() => alert("Esta función aún no está implementada.")}>
				<Text style={styles.saveBtnTxt}>Guardar</Text>
			</TouchableOpacity>
		</View>
		{!showPwdChange ? "" : (
			<>
				<View style={styles.pwdChangeBg}></View>
				<View style={styles.pwdChange}>
					<Text style={styles.sectionHeader}>Cambiar contraseña</Text>
					<Text style={styles.label}>Contraseña actual</Text>
					<TextInput 
						style={styles.input}
						secureTextEntry={true}
					/>
					<Text style={styles.label}>Contraseña nueva</Text>
					<TextInput 
						style={styles.input}
						secureTextEntry={true}
					/>
					<Text style={styles.label}>Confirmar contraseña nueva</Text>
					<TextInput 
						style={styles.input}
						secureTextEntry={true}
					/>
					<TouchableOpacity style={styles.btn} onPress={() => {
						alert("Esta función aún no está implementada.");
						setShowPwdChange(false);
					}}>
						<Text style={styles.btnTxt}><Icon name="check" size="18" /> Confirmar</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => setShowPwdChange(false)}>
						<Text style={styles.btnTxt}>Cancelar</Text>
					</TouchableOpacity>
				</View>
			</>
		)}
	</>);
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: '#000',
	padding: 16
  },
  sectionHeader: {
	textAlign: "center",
	color: "#fff",
	fontSize: 24,
	fontWeight: "bold",
	textDecorationLine: "underline"
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
	backgroundColor: "#0a0",
	padding: 10,
	borderRadius: 10,
	marginVertical: 10
  },
  btnRed: {
	backgroundColor: "#a00"
  },
  btnTxt: {
	color: "#fff",
	fontSize: 18,
	fontWeight: "bold",
	textAlign: "center"
  },
  saveBtn: {
	display: "block",
	backgroundColor: "#00c",
	padding: 10,
	borderRadius: 10
  },
  saveBtnTxt: {
	color: "#fff",
	fontWeight: "bold",
	fontSize: 18,
	textAlign: "center"
  },
  pwdChangeBg: {
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backgroundColor: "#000c",
	zIndex: 1
  },
  pwdChange: {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "80%",
	zIndex: 1
  }
});
