import ApiService from './ApiService';
import UXService from "@/services/UXService.js";

export default class SearchService {

    static async loadPokemonInfo(pokemonId) {
        try {
            return await ApiService.makeRequest("/pokemon/" + pokemonId);
        } catch (error) {
            UXService.error("An error occurred while loading data.", error)
        }
    }

    static async searchKeyword(type, keyword) {
        try {
            return await ApiService.makeRequestWithoutThrowingError("/search/" + type + "/" + keyword);
        } catch (error) {
            UXService.error("An error occurred while searching.", error)
        }
    }


}