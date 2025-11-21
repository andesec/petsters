class TypeService {
    static getTypeColor(type) {
        const typeColors = {
            Fire: "#e15115",
            Water: "#2260f6",
            Grass: "#48c309",
            Electric: "#F8D030",
            Ice: "#98D8D8",
            Fighting: "#C03028",
            Poison: "#A040A0",
            Ground: "#7c5e0b",
            Flying: "#b19bef",
            Psychic: "#F85888",
            Bug: "#A8B820",
            Rock: "#ca904e",
            Ghost: "#705898",
            Dragon: "#7038F8",
            Dark: "#35302d",
            Steel: "#d9d9e4",
            Fairy: "#fa8ca6",
        };
        return typeColors[type] || "#A8A8A8";
    }
}

export default TypeService;