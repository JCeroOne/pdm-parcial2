import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

import { useRouter } from 'expo-router';

export default function TabOneScreen() {

		const router = useRouter();

		return (
            <View style={styles.container}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput style={styles.input} placeholder="Usuario1" />
                <Text style={styles.label}>Contraseña</Text>
                <TextInput style={styles.input} placeholder="Contraseña1" secureTextEntry={true} />
                <Text style={styles.label}>Confirmar contraseña</Text>
                <TextInput style={styles.input} placeholder="Contraseña1" secureTextEntry={true} />
                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginBtnTxt} onPress={() => {
                        alert("Esta función aún no está implementada.");
                        router.navigate("/");
                    }}>Registrarse</Text>
                </TouchableOpacity>
            </View>
		);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30,
        paddingVertical: 10
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
	}
});
