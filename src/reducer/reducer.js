import {
  ADD_AUDIT,
  SET_AUDITEUR,
  DELETE_AUDIT,
  ADD_AUDIT_BY_LOCALSTORAGE,
  SET_AUDIT,
  SET_VALUE_MENU_STATUS,
  EDIT_AUDIT,
  MANAGER_AUDITOR,
  MANAGER_APPLICANT,
  MANAGER_CATEGORIES_FORMS,
  MANAGER_FORMS,
  MANAGER_FORMS_ADD,
  MANAGER_FORMS_SET_CATEGORY_SELECTED,
  LOAD_LOCALSTORAGE
} from '../reducer/ActionsType';

export const initialState = [
  {
    "auditeur": [],
    "demandeur": [],
    "valueStatusMenu": "",
    "datas": [],
    "forms": {
    },
    "checkboxAudit": [
    ],
    "settings": {
      "select": {
        "options": ["", 'OK', 'NOK', 'INDISPONIBLE', 'MANQUANT']
      },
      "allForms": [],
      "formCategorySelected": ""
    }
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
    case MANAGER_AUDITOR:
      if (payload.action === "delete") {
        return managerAuditorDelete(state, payload.array)
      }
      if (payload.action === "add") {
        return managerAuditorAdd(state, payload.array)
      }
      break
    case MANAGER_APPLICANT:
      if (payload.action === "delete") {
        return managerApplicantDelete(state, payload.array)
      }
      if (payload.action === "add") {
        return managerApplicantAdd(state, payload.array)
      }
      break

    case MANAGER_CATEGORIES_FORMS:
      if (payload.action === "add_category") {
        return managerCategoryAdd(state, payload)
      }
      if (payload.action === "delete_category") {
        return managerCategoryDelete(state, payload)
      }
      break

    case MANAGER_FORMS:
      return managerFormsSettingsAdd(state, payload)

    case MANAGER_FORMS_ADD:
      return managerFormsSettingsAddFormToCategory(state, payload)
    case MANAGER_FORMS_SET_CATEGORY_SELECTED:
      // tout peter
      let newState = [...payload.storage]
      newState[0].settings.formCategorySelected = payload.item
      saveLocalStorage(newState)
      return newState

    case LOAD_LOCALSTORAGE:
      console.log(payload)
      return state
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

    let newObj = {}
    let category = payload.newState.category
    for (let item in state[0].forms) {
      let objState = state[0].forms[`${item}`]
      let objUser = payload.newState.audit

      if (item === category) {
        for (let cat in objState) {
          let name = objState[cat].name
          if (objUser.hasOwnProperty(name)) {
            newObj[`${name}`] = objUser[`${name}`]
          }
        }
      }
    }

    newState[0].datas[position] = payload.newState
    newState[0].datas[position].audit = newObj
  }
  saveLocalStorage(newState)
  return newState
}

const managerAuditorDelete = (state, payload) => {
  let newState = [...state]
  newState[0].auditeur = payload
  saveLocalStorage(newState)
  return newState
}

const managerAuditorAdd = (state, payload) => {
  let newState = [...state]
  newState[0].auditeur = payload
  saveLocalStorage(newState)
  return newState
}

const managerApplicantDelete = (state, payload) => {
  let newState = [...state]
  newState[0].demandeur = payload
  saveLocalStorage(newState)
  return newState
}

const managerApplicantAdd = (state, payload) => {
  let newState = [...state]
  newState[0].demandeur = payload
  saveLocalStorage(newState)
  return newState
}

const managerCategoryAdd = (state, payload) => {
  let obj_category = { label: payload.value, name: 'group1', type: 'radio', id: payload.value }
  let newState = [...state]
  newState[0].checkboxAudit.push(obj_category)
  newState[0].forms[`${payload.value}`] = []
  saveLocalStorage(newState)
  return newState
}

const managerCategoryDelete = (state, payload) => {

  let newState = [...state]
  newState[0].checkboxAudit = payload.array
  delete newState[0].forms[`${payload.value}`]

  saveLocalStorage(newState)
  return newState
}


const managerFormsSettingsAdd = (state, payload) => {
  let newState = [...state]
  newState[0].settings.allForms = [...state[0].settings.allForms, payload]
  saveLocalStorage(newState)
  return newState
}

const managerFormsSettingsAddFormToCategory = (state, payload) => {
  let category = payload.category
  let newState = [...state]
  newState[0].forms[`${category}`] = payload.forms[`${category}`]
  saveLocalStorage(newState)
  return newState
}
