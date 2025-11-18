import { FlatList, StyleSheet, View } from "react-native";
import MatchCard from "../components/matchCard";

const matchesMock = [
  {
    id: '1',
    duration: '32:02',
    mode: 'Normal Draft',
    win: true,

    champion_id: 82,
    lane: 'TOP',
    champion_level: 15,
    item_slots: [3860, 3158, 6691, 3814, 3117, 3026],
    trinket: 3364,
    total_minions: 32,
    vision_score: 45,
    kills: 6, 
    deaths: 3, 
    assists: 11,
    kda_value: 5.7, 
  },
  {
    id: '2',
    duration: '38:22',
    mode: 'Normal Draft',
    win: true,

    champion_id: 53,      
    lane: 'SUPPORT',
    champion_level: 17,
    item_slots: [3860, 3117, 3190, 3109, 3050, 3067],
    trinket: 3364,
    total_minions: 25,
    vision_score: 55,
    kills: 5, 
    deaths: 12, 
    assists: 19,
    kda_value: 2.0,             
  },
  {
    id: '3',
    duration: '33:52',
    mode: 'Normal Draft',
    win: true,

    champion_id: 893,          
    lane: 'TOP',
    champion_level: 17,
    item_slots: [3504, 6617, 2065, 3158, 3107, 3190],
    trinket: 3364,
    total_minions: 40,
    vision_score: 60,
    kills: 16, 
    deaths: 0, 
    assists: 5,
    kda_value: 21.0,
  },
  {
    id: '4',
    duration: '36:04',
    mode: 'Flex',
    win: false,

    champion_id: 82,         
    lane: 'TOP',
    champion_level: 14,
    item_slots: [3860, 3158, 6691, 3814, 6676, 3036],
    trinket: 3364,
    total_minions: 28,
    vision_score: 38,
    kills: 3, 
    deaths: 13, 
    assists: 5,
    kda_value: 0.6,             
  },
  {
    id: '5',
    duration: '22:56',
    mode: 'Flex',
    win: true,

    champion_id: 24,
    lane: 'TOP',
    champion_level: 13,
    item_slots: [6671, 3006, 3094, 3036, 3031, 3035],
    trinket: 3363,
    total_minions: 180,
    vision_score: 20,
    kills: 6, 
    deaths: 2, 
    assists: 4,
    kda_value: 5.0,
  },
  {
    id: '6',
    duration: '25:20',
    mode: 'Flex',
    win: true,

    champion_id: 893,          
    lane: 'TOP',
    champion_level: 14,
    item_slots: [3504, 6617, 2065, 3158, 3107, 3190],
    trinket: 3364,
    total_minions: 45,
    vision_score: 50,
    kills: 11, 
    deaths: 6, 
    assists: 10,
    kda_value: 3.5,
  },
];

export default function PartidasScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={matchesMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
});
