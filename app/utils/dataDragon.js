export async function getChampionIcon(championId, version = "15.22.1") {
  
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

  const data = await fetch(url).then(r => r.json());
  
  const champions = Object.values(data.data);

  const champ = champions.find(c => c.key === String(championId));

  if (!champ) return null;

  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.id}.png`;
}
