import axios from 'axios';
import {
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_LIST_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	PRODUCT_DELETE_SUCCESS,
	PRODUCT_DELETE_REQUEST,
	PRODUCT_DELETE_FAIL,
	PRODUCT_CREATE_REQUEST,
	PRODUCT_CREATE_SUCCESS,
	PRODUCT_CREATE_FAIL,
	PRODUCT_UPDATE_REQUEST,
	PRODUCT_UPDATE_SUCCESS,
	PRODUCT_UPDATE_FAIL,
	PRODUCT_CREATE_REVIEW_REQUEST,
	PRODUCT_CREATE_REVIEW_SUCCESS,
	PRODUCT_CREATE_REVIEW_FAIL,
	PRODUCT_TOP_REQUEST,
	PRODUCT_TOP_SUCCESS,
	PRODUCT_TOP_FAIL,
} from '../constants/productConstants';
import { logout } from './userActions';

export const listProducts = (keyword = '') => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'http://localhost:5000/graphql',
			JSON.stringify({
				query: `{
				searchProduct (searchTerm: "${keyword}") {
					_id
					name
					user {
						_id
						name
						phoneNo
					}
					image
					brand {
						_id
						name
					}
					category {
						_id
						name
					}
					questions {
						_id
						question
						ans
						type
					}
					description
					location {
						type
						coordinates
					}
				}
			}
			`,
			}),
			config
		);

		console.log(data);

		dispatch({
			type: PRODUCT_LIST_SUCCESS,
			payload: data.data.searchProduct,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const listProductDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			`http://localhost:5000/graphql`,
			JSON.stringify({
				query: ` {
				getProductById (id: "${id}") {
					_id
					name
					user {
						_id
						name
						phoneNo
					}
					image
					brand {
						_id
						name
					}
					category {
						_id
						name
					}
					questions {
						_id
						question
						ans
						type
					}
					description
					location {
						type
						coordinates
					}
				}
			}
		`,
			}),
			config
		);
		console.log(data.data.getProductById);

		dispatch({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: data.data.getProductById[0],
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const deleteProduct = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_DELETE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await axios.delete(`/api/products/${id}`, config);

		dispatch({
			type: PRODUCT_DELETE_SUCCESS,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: PRODUCT_DELETE_FAIL,
			payload: message,
		});
	}
};

export const createProduct = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_CREATE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
				'Content-Type': 'application/json',
			},
		};

		const dummy = {
			user: userInfo._id,
			name: '',
			image: '',
			brand: '',
			category: 'Miscellaneous',
			subcategory: 'default',
			questions: '',
			location: {
				type: 'Point',
				coordinates: [19.076, 72.8777],
			},
			description: '',
		};

		const { data } = await axios.post(
			`http://localhost:5000/`,
			JSON.stringify({
				mutation: ` {
					createProduct (productInput: ${dummy}) {
					_id
					name
					user {
						_id
						name
						phoneNo
					}
					image
					brand {
						_id
						name
					}
					category {
						_id
						name
					}
					questions {
						_id
						question
						ans
						type
					}
					description
					location {
						type
						coordinates
					}
				}
			}
		`,
			}),
			config
		);

		dispatch({
			type: PRODUCT_CREATE_SUCCESS,
			payload: data.data.createApplication,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: PRODUCT_CREATE_FAIL,
			payload: message,
		});
	}
};

export const updateProduct = (product) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_UPDATE_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(
			`/api/products/${product._id}`,
			product,
			config
		);

		dispatch({
			type: PRODUCT_UPDATE_SUCCESS,
			payload: data.data,
		});
		dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: PRODUCT_UPDATE_FAIL,
			payload: message,
		});
	}
};

export const createProductReview = (productId, review) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: PRODUCT_CREATE_REVIEW_REQUEST,
		});

		const {
			userLogin: { userInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await axios.post(`/api/products/${productId}/reviews`, review, config);

		dispatch({
			type: PRODUCT_CREATE_REVIEW_SUCCESS,
		});
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: PRODUCT_CREATE_REVIEW_FAIL,
			payload: message,
		});
	}
};

export const listTopProducts = () => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_TOP_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'http://localhost:5000/graphql',
			JSON.stringify({
				query: `
				{
					getProducts {
						_id
						name
						user {
							_id
							name
						}
						image
						brand {
							_id
							name
						}
						category {
							_id
							name
						}
						subcategory {
							_id
							name
						}
						description
					}
				}`,
			}),
			config
		);

		dispatch({
			type: PRODUCT_TOP_SUCCESS,
			payload: data.data.getProducts,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_TOP_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
