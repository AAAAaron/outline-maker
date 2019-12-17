import CharacterModal from '../models/Character';
import { deleteOutlineDetailsGivenChar } from './detail-ops';

type CharacterProps = {
	outline_id?: number | string;
	novel_id?: number | string;
	name?: string;
	image?: string;
	age?: string;
	nickname?: string;
	gender?: number;
	height?: string;
	identity?: string;
	appearance?: string;
	characteristics?: string;
	experience?: string;
};

// get character given character id
export const getCharacter = (id: string | number): Promise<any> => {
	return CharacterModal
		.findOne({
			where: {
				id
			}
		});
};

// get all characters given novel id
export const getAllCharactersByNovel = (id: string | number): Promise<any> => {
	return CharacterModal
		.findAll({
			where: {
				novel_id: id
			},
			order: [['id', 'ASC']]
		});
};

// get all characters given outline id
export const getAllCharacters = (id: string): Promise<any> => {
	return CharacterModal
		.findAll({
			where: {
				outline_id: id
			}
		});
};

// create new character
export const createCharacter = (
	novel_id: string,
	outline_id: string | null,
	name: string,
	color: string | null
): Promise<any> => {
	return CharacterModal
		.create({
			name,
			novel_id,
			outline_id,
			color: color ? color : '#ffa39e'
		});
};

// update current character
export const updateCharacter = (id: string | number, name: string, color: string): Promise<any> => {
	const modalToUpdate: { name?: string, color?: string } = {};
	if (name) modalToUpdate.name = name;
	if (color) modalToUpdate.color = color;
	return CharacterModal
		.update(
			modalToUpdate,
			{ where: { id } }
		);
};

// update character with more details
export const updateCharacterDetail = (id: string | number, props: CharacterProps) => {
	return CharacterModal
		.update(
			{ ...props },
			{ where: { id } }
		);
};

// delete character
export const deleteCharacter = async (id: string | number): Promise<any> => {
	await deleteOutlineDetailsGivenChar(id);
	return CharacterModal
		.destroy({
			where: { id }
		});
};
