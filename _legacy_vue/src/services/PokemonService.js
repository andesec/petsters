import ApiService from './ApiService';
import UXService from "@/services/UXService.js";

export default class PokemonService {

    static async loadPokemonInfo(pokemonId) {
        try {
            return await ApiService.makeRequest("/pokemon/" + pokemonId);
        } catch (error) {
            UXService.error("An error occurred while loading data.", error)
        }
    }

    static async searchPokemonInfo(pokemon) {
        try {
            return await ApiService.makeRequestWithoutThrowingError("/pokemon/search/" + pokemon);
        } catch (error) {
            UXService.error("An error occurred while searching.", error)
        }
    }


}