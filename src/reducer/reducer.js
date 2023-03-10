import {
  ADD_AUDIT,
  SET_AUDITEUR,
  DELETE_AUDIT,
  ADD_AUDIT_BY_LOCALSTORAGE,
  SET_AUDIT,
  SET_VALUE_MENU_STATUS,
  EDIT_AUDIT
} from '../reducer/ActionsType';

export const initialState = [
  {
    "auditeur": "",
    "demandeur": "",
    "valueStatusMenu": "",
    "datas": []
  }
];

export const reducer = (state = initialState, action) => {

  const { type, payload } = action;
  switch (type) {
    case ADD_AUDIT:
      return addAudit(state, payload);
    case DELETE_AUDIT:
      return deleteAudit(state, payload);
    case SET_AUDITEUR:
      saveLocalStorage(payload)
      return payload;
    case ADD_AUDIT_BY_LOCALSTORAGE:
      return payload;
    case SET_AUDIT:
      setAudit(state, payload)
      return state
    case SET_VALUE_MENU_STATUS:
      return setValueMenu(state, payload)
    case EDIT_AUDIT:
      return editAudit(state, payload)
    default:
      return state;
  }
}


const addAudit = (state, payload) => {
  let newState = [...state]
  if (payload !== undefined) {
    let newDatas = [...state[0].datas, payload]
    newState[0].datas = newDatas
  }
  saveLocalStorage(newState)
  return newState
}

const deleteAudit = (state, payload) => {
  let newState = [...state]
  if (payload !== undefined) {
    let newDatas = state[0].datas.filter(item => item.gbook !== payload)
    newState[0].datas = newDatas
  }
  saveLocalStorage(state, newState)
  return newState
}

const saveLocalStorage = (locale) => {
  localStorage.setItem("datas", JSON.stringify(locale))
}

const setAudit = (state, payload) => {
  let newState = [...state]
  if (payload !== undefined) {
    let position = 0
    let index = 0
    for (let item of state[0].datas) {
      if (item.gbook === payload.gbook) {
        position = index
      }
      index++
    }
    newState[0].datas[position] = payload.obj
  }
  saveLocalStorage(newState)
}

const setValueMenu = (state, payload) => {
  let newState = [...state]
  newState[0]["valueStatusMenu"] = payload
  localStorage.setItem("datas", JSON.stringify(newState))
  return newState
}

const editAudit = (state, payload) => {
  let newState = [...state]
  if (payload !== undefined) {
    let position = 0
    let index = 0
    for (let item of state[0].datas) {
      if (item.gbook === payload.lastGbook) {
        position = index
      }
      index++
    }
    newState[0].datas[position] = payload.newState
  }
  saveLocalStorage(newState)
  return newState
}