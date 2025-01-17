import ApiService from './ApiService';
import UXService from "@/services/UXService.js";

export default class PokemonService {

    static async loadPokemonInfo(pokemonId) {
        try {
            return await ApiService.makeRequest("/pokemon/" + pokemonId);
        } catch (error) {
            UXService.error("An error occurred while saving your party.", error)
        }
    }


}