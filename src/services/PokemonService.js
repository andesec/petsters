import ApiService from './ApiService';
import UXService from "@/services/UXService.js";

export default class PokemonService {

    static async loadPokemonInfo(pokemonId) {
        try {
            const response = await ApiService.makeRequest("/pokemon/" + pokemonId);
            UXService.notify(response.message)
            return response;
        } catch (error) {
            UXService.error("An error occurred while saving your party.", error)
        }
    }


}