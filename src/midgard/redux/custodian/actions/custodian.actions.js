//get custodians action constants
export const GET_CUSTODIANS = "CUSTODIAN/GET_CUSTODIANS";
export const GET_CUSTODIANS_SUCCESS = "CUSTODIAN/GET_CUSTODIANS_SUCCESS";
export const GET_CUSTODIANS_FAILURE = "CUSTODIAN/GET_CUSTODIANS_FAILURE";

//add custodian action constants
export const ADD_CUSTODIANS = "CUSTODIAN/ADD_CUSTODIANS";
export const ADD_CUSTODIANS_SUCCESS = "CUSTODIAN/ADD_CUSTODIANS_SUCCESS";
export const ADD_CUSTODIANS_FAILURE = "CUSTODIAN/ADD_CUSTODIANS_FAILURE";

//edit custodian action constants
export const EDIT_CUSTODIANS = "CUSTODIAN/EDIT_CUSTODIANS";
export const EDIT_CUSTODIANS_SUCCESS = "CUSTODIAN/EDIT_CUSTODIANS_SUCCESS";
export const EDIT_CUSTODIANS_FAILURE = "CUSTODIAN/EDIT_CUSTODIANS_FAILURE";

//delete custodian action constants
export const DELETE_CUSTODIANS = "CUSTODIAN/DELETE_CUSTODIANS";
export const DELETE_CUSTODIANS_SUCCESS = "CUSTODIAN/DELETE_CUSTODIANS_SUCCESS";
export const DELETE_CUSTODIANS_FAILURE = "CUSTODIAN/DELETE_CUSTODIANS_FAILURE";

//search custodian action constants
export const SEARCH = "CUSTODIAN/SEARCH";
export const SEARCH_SUCCESS = "CUSTODIAN/SEARCH_SUCCESS";

//get custodian tyoe action constants
export const GET_CUSTODIAN_TYPE = "CUSTODIAN/GET_CUSTODIAN_TYPE";
export const GET_CUSTODIAN_TYPE_SUCCESS =
  "CUSTODIAN/GET_CUSTODIAN_TYPE_SUCCESS";
export const GET_CUSTODIAN_TYPE_FAILURE =
  "CUSTODIAN/GET_CUSTODIAN_TYPE_FAILURE";

//get contact action constants
export const GET_CONTACT = "CUSTODIAN/GET_CONTACT";
export const GET_CONTACT_SUCCESS = "CUSTODIAN/GET_CONTACT_SUCCESS";
export const GET_CONTACT_FAILURE = "CUSTODIAN/GET_CONTACT_FAILURE";

export const getCustodians = () => ({ type: GET_CUSTODIANS });

/**
 *Add custodian
 * @param {Object} payload
 * @param {Object} history
 */
export const addCustodians = (payload, history) => ({
  type: ADD_CUSTODIANS,
  payload,
  history,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 */
export const editCustodian = (payload, history) => ({
  type: EDIT_CUSTODIANS,
  payload,
  history,
});

/**
 *Selete Custodain entity
 * @param {{id}} payload
 */
export const deleteCustodian = (custodianId, contactObjId) => ({
  type: DELETE_CUSTODIANS,
  custodianId,
  contactObjId,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchCustodian = (searchItem, searchList) => ({
  type: SEARCH,
  searchItem,
  searchList,
});

export const getCustodianType = () => ({
  type: GET_CUSTODIAN_TYPE,
});

export const getContact = () => ({
  type: GET_CONTACT,
});
