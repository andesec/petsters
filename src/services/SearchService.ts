import ApiService from './ApiService';
import UXService from './UXService';

export default class SearchService {

    static async loadPokemonInfo(pokemonId: string | number) {
        try {
            return await ApiService.makeRequest("/pokemon/" + pokemonId);
        } catch (error) {
            UXService.error("An error occurred while loading data.", error);
        }
    }

    static async searchKeyword(type: string, keyword: string) {
        try {
            return await ApiService.makeRequestWithoutThrowingError("/search/" + type + "/" + keyword);
        } catch (error) {
            UXService.error("An error occurred while searching.", error);
        }
    }
}
