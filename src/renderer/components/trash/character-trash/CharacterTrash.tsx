import * as React from 'react';
import { Col, message as Message, Card, Row, Modal, Button } from 'antd';

// type declaration
import { CharacterTrashProps } from './characterTrashDec';
import { CharacterShortDataValue } from '../../character/characterDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getCharacterShort } from '../../../../db/operations/character-ops';
import { deleteCharacterPermanently, putbackCharacter } from '../../../../db/operations/trash-ops';

const CharacterTrash = (props: CharacterTrashProps) => {
	const { characters, refresh } = props;

	// hooks
	const [showBackModal, setBackModal] = React.useState<boolean>(false);
	const [showDeleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<string | number>('');
	const [characterDetails, setCharacterDetails] = React.useState<CharacterShortDataValue[]>([]);

	// get characters when props.characters changes & didmount
	React.useEffect(getCharacters, [props.characters]);

	// get characters
	function getCharacters() {
		const promises: Promise<any>[] = characters.map((character_id: number) => {
			return getCharacterShort(character_id);
		});
		Promise
			.all(promises)
			.then((result: any) => {
				const characters = result.map(({ dataValues }: { dataValues: CharacterShortDataValue }) => dataValues);
				setCharacterDetails(characters);
			});
	}

	// open back modal
	function onOpenBackModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setBackModal(true);
		setSelected(id);
	}

	// close back modal
	function onCloseBackModal() {
		setSelected('');
		setBackModal(false);
	}

	// open delete modal
	function onOpenDeleteModal(e: React.MouseEvent, id: string | number) {
		// prevent bubbling
		e.preventDefault();

		// set selected
		setDeleteModal(true);
		setSelected(id);
	}

	// close delete modal
	function onCloseDeleteModal() {
		setSelected('');
		setDeleteModal(false);
	}

	// delete character
	function onDeleteCharacter() {
		// delete character permanently from db
		deleteCharacterPermanently(selected)
			.then(() => {
				// alert success
				Message.success('永久删除角色成功！');
				// close modal
				onCloseDeleteModal();
				// refresh characters
				refresh();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// put back character
	function onPutBackCharacter() {
		// put back character from db
		putbackCharacter(selected)
			.then(() => {
				// alert success
				Message.success('角色已经放回原处！');
				// close modal
				onCloseBackModal();
				// refresh characters
				refresh();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<Row>
			{
				characterDetails.map((character: CharacterShortDataValue) => (
					<Col span={8} key={character.id}>
						<Card
							title={character.name}
							bordered={false}
							hoverable
							className="custom-card"
						>
							<Button
								type="danger"
								ghost
								block
								className="green-button put-back-button"
								onClick={(e: React.MouseEvent) => onOpenBackModal(e, character.id)}
							>
								放回原处
							</Button>
							<Button
								type="danger"
								ghost
								block
								onClick={(e: React.MouseEvent) => onOpenDeleteModal(e, character.id)}
							>
								永久删除
							</Button>
						</Card>
					</Col>
				))
			}
			<Modal
				title="永久删除角色"
				visible={showDeleteModal}
				onOk={onDeleteCharacter}
				onCancel={onCloseDeleteModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseDeleteModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onDeleteCharacter}
						ghost
					>确认
					</Button>
				]}
			>
				角色永久删除后无法恢复！！！
			</Modal>
			<Modal
				title="放回角色"
				visible={showBackModal}
				onOk={onPutBackCharacter}
				onCancel={onCloseBackModal}
				footer={[
					<Button type="danger" key="back" onClick={onCloseBackModal} ghost>取消</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={onPutBackCharacter}
						ghost
					>确认
					</Button>
				]}
			>
				是否将角色放回原处？
			</Modal>
		</Row>
	);
};

export default CharacterTrash;
