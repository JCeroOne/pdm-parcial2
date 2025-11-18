import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getChampionIcon } from "../utils/dataDragon";

export default function MatchCard({ match }) {

    const [championIconUrl, setChampionIconUrl] = React.useState(null);

    React.useEffect(() => {
        async function loadIcon() {
            const url = await getChampionIcon(match.champion_id);
            setChampionIconUrl(url);
        }

        loadIcon();
    }, [match.champion_id]);

    return (
        <View style={[
            styles.card,
            match.win === true ? styles.win : styles.loss,
        ]}>
            <View style={styles.mainRow}>
                <View style={styles.colLeft}>
                    <View style={styles.leftTextBlock}>
                        <Text style={styles.duration}>{match.duration}</Text>
                        <Text style={styles.mode}>{match.mode}</Text>
                    </View>

                    {championIconUrl && (
                        <Image
                            source={{ uri: championIconUrl }}
                            style={styles.icon}
                        />
                    )}
                </View>

                <View style={styles.colCenter}>
                    <Text style={styles.kda}>
                        {match.kills} / {match.deaths} / {match.assists}
                    </Text>
                </View>

                <View style={styles.colRight}>
                    <View style={styles.itemsGrid}>
                        {match.item_slots.map(itemId => (
                            <Image
                                key={itemId}
                                source={{ uri: `https://ddragon.leagueoflegends.com/cdn/15.22.1/img/item/${itemId}.png` }}
                                style={styles.itemIcon}
                            />
                        ))}
                    </View>
                    <Image
                        source={{ uri: `https://ddragon.leagueoflegends.com/cdn/15.22.1/img/item/${match.trinket}.png` }}
                        style={styles.ward}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        marginBottom: 12,
        borderRadius: 10,
    },
    mainRow: {
        flexDirection: 'row',
    },
    colLeft: {
        flex: 1.7,
        flexDirection: 'row',      
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 17
    },
    leftTextBlock: {
        flexDirection: 'column',
    },
    colCenter: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    colRight: {
        flex: 1.2,
        flexDirection: 'row',
    },
    duration: {
        color: '#fff',
    },
    mode: {
        color: '#fff',
        fontWeight: 'bold',
    },
    kda: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    win: {
        backgroundColor: '#4e9367ff',
    },
    loss: {
        backgroundColor: '#9c3d3dff',
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 3
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        maxWidth: 81,
    },
    itemIcon: {
        width: 25,
        height: 25,
        borderRadius: 4
    },
    ward: {
        width: 25,
        height: 25,
        borderRadius: 4,
    }
});