class ImageService {
    static getImageURLForPokemon(id: string | number) {
        return `/assets/mon/nor/${id}.svg`;
    }

    static getImageURLForGymMaster(name: string) {
        return `/assets/gym/leader/${name}.png`;
    }

    static getImageURLForGymMedal(name: string) {
        return `/assets/gym/medal/${name}.png`;
    }
}

export default ImageService;
