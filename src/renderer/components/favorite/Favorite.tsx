import * as React from 'react';
import { Col, Row, Card, Button, Modal, message as Message } from 'antd';
import classnames from 'classnames';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { DatabaseError } from 'sequelize';
import { FavoriteProps, FavoriteState, FavoriteDataValue } from './favoriteDec';
import { OutlineDataValue, Outline } from '../sidebar/sidebarDec';

// database operations
import { findAllFav, deleteFavorite } from '../../../db/operations/fav-ops';
import { getAllNonDeletedOutlinesRange, updateOutlineFav } from '../../../db/operations/outline-ops';

// sass
import './favorite.scss';

// image
import empty from '../../../public/empty-fav.png';

class Favorite extends React.Component<FavoriteProps, FavoriteState> {
	constructor(props: FavoriteProps) {
		super(props);
		this.state = {
			outlines: [],
			confirmVisible: false,
			selected: 0
		};
	}

	componentDidMount = () => {
		findAllFav()
			.then((result: any) => {
				// all outlines in favorite
				const outlines: string[] = result.map(({ dataValues }: { dataValues: FavoriteDataValue }) => {
					return dataValues.outline_id;
				});

				// grab title and description for those outlines
				return getAllNonDeletedOutlinesRange(outlines);
			})
			.then((result: any) => {
				// all detailed outlines in favorite
				const outlines: Outline[] = result.map(({ dataValues }: { dataValues: OutlineDataValue }) => {
					return { id: dataValues.id, title: dataValues.title, description: dataValues.description };
				});
				this.setState({
					outlines
				});
			})
			.catch((err: DatabaseError) => {
				console.error(err);
			});
	}

	// open cancel favorite modal
	onOpen = (id: number, e: any) => {
		// stop bubbling
		e.stopPropagation();
		this.setState({ confirmVisible: true, selected: id });
	}

	// cancel cancel favorite modal
	onCancel = () => {
		this.setState({ confirmVisible: false, selected: 0 });
	}

	// cancel favorite
	onCancelFavorite = () => {
		Promise
			.all([deleteFavorite(this.state.selected), updateOutlineFav(this.state.selected, 0)])
			.then(() => {
				// alert success
				Message.success('已取消收藏！');
				// close modal
				this.setState(
					(prevState: FavoriteState) => ({
						...prevState,
						outlines: prevState.outlines.filter((outline: Outline) => outline.id !== this.state.selected),
						confirmVisible: false,
						selected: 0
					}));
			})
			.catch((err: DatabaseError) => {
				// alert error
				Message.error(err.message);
				// close modal
				this.setState((prevState: FavoriteState) => ({
					...prevState,
					confirmVisible: false,
					selected: 0
				}));
			});
	}

	// go to outline page
	toOutline = (id: number) => {
		this.props.history.push(`/outline/${id}`);
	}

	render() {
		const { expand } = this.props;

		return (
			<Col
				span={19}
				className={
					classnames('favorite', {
						'main-grow': !expand
					})
				}
			>
				{
					(this.state.outlines.length === 0) && (
						<div className="empty-fav">
							<h2>收藏夹是空的哟...</h2>
							<br />
							<img src={empty} alt="empty trash" />
						</div>
					)
				}
				<Row>
					{
						this.state.outlines.map((outline: Outline) => (
							<Col span={8} key={outline.id}>
								<Card
									title={outline.title}
									bordered={false}
									hoverable
									className="custom-card"
									onClick={() => this.toOutline(outline.id)}
								>
									<p className="description">{outline.description}</p>
									<br /><br />
									<Button type="danger" ghost block onClick={(e: any) => this.onOpen(outline.id, e)}>取消收藏</Button>
								</Card>
							</Col>
						))
					}
				</Row>
				<Modal
					title="取消收藏"
					visible={this.state.confirmVisible}
					onOk={this.onCancelFavorite}
					onCancel={this.onCancel}
					footer={[
						<Button type="danger" key="back" onClick={this.onCancel} ghost>取消</Button>,
						<Button type="primary" key="submit" onClick={this.onCancelFavorite} ghost>确认</Button>
					]}
				>
					<p>确认取消收藏吗？</p>
				</Modal>
			</Col>
		);
	}
}

export default withRouter(Favorite);
