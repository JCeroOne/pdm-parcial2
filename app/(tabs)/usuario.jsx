import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { setAuthToken } from '../utils/api';

function Icon(props) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}


export default function Usuario() {

	const router = useRouter();

	function logout(){
		setAuthToken();
		router.navigate("/");
	}

	return(<>
		<View style={styles.container}>
			<TouchableOpacity style={[styles.btn]} onPress={() => logout()}>
				<Text style={styles.btnTxt}>Cerrar sesión <Icon name="angle-right" size="18" /></Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn]} onPress={() => router.push("/settings/linkLOLAccount")}>
				<Text style={styles.btnTxt}>Vincular cuenta de LoL <Icon name="angle-right" size="18" /></Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn]} onPress={() => router.push("/settings/changePassword")}>
				<Text style={styles.btnTxt}>Cambiar contraseña <Icon name="angle-right" size="18" /></Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => router.push("/settings/deleteAccount")}>
				<Text style={styles.btnTxt}>Eliminar cuenta <Icon name="angle-right" size="18" /></Text>
			</TouchableOpacity>
		</View>
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
	backgroundColor: "#00c",
	padding: 10,
	borderRadius: 10,
	marginVertical: 10
  },
  btnGray: {
	backgroundColor: "#333"
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
