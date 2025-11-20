import ApiService from './ApiService';
import UXService from './UXService';

export default class PokemonService {

    static async loadPokemonInfo(pokemonId: string | number) {
        try {
            return await ApiService.makeRequest("/pokemon/" + pokemonId);
        } catch (error) {
            UXService.error("An error occurred while loading data.", error);
        }
    }

    static async searchPokemonInfo(pokemon: string) {
        try {
            return await ApiService.makeRequestWithoutThrowingError("/pokemon/search/" + pokemon);
        } catch (error) {
            UXService.error("An error occurred while searching.", error);
        }
    }
}
