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
  MANAGER_FORMS_EDIT,
  MANAGER_FORMS_SET_CATEGORY_SELECTED,
  LOAD_LOCALSTORAGE,
  MANAGER_FORMS_CSV,
  MANAGER_FORMS_SELECTED_DELETE,
  MANAGER_FORMS_DELETE,
  DELETE_ALL_DATAS
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
        "options": ["", 'OK', 'NOK', 'INDISPONIBLE', 'MANQUANT', "NON VENDABLE", "A DEMANTELER", "VENDABLE", "NON ELIGIBLE E-COM", "ELIGIBLE E-COM"]
      },
      "allForms": [],
      "formCategorySelected": "",
      "natureDemande": {
        "options": ["AUDIT"]
      },
      "demande": {
        "options": ["NON VENDABLE", "A DEMANTELER", "VENDABLE", "NON ELIGIBLE E-COM", "ELIGIBLE E-COM"]
      },
      "statut": {
        "options": ["A TRAITER", "EN COURS", "TERMINE"]
      }
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

    case DELETE_ALL_DATAS:
      return deleteAllDatas(payload)

    case EDIT_AUDIT:
      return editAudit(state, payload)
    case MANAGER_AUDITOR:
      if (payload.action === "delete") {
        return managerAuditorDelete(state, payload.array)
      }
      if (payload.action === "add") {
        return managerAuditorAdd(state, payload.array)
      }
      if (payload.action === "edit") {
        return managerAuditorEdit(payload)
      }
      break
    case MANAGER_APPLICANT:
      if (payload.action === "delete") {
        return managerApplicantDelete(state, payload.array)
      }
      if (payload.action === "add") {
        return managerApplicantAdd(state, payload.array)
      }
      if (payload.action === "edit") {
        return managerApplicantEdit(payload)
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
      return managerFormsSettingsAdd(payload)

    case MANAGER_FORMS_CSV:
      return managerFormsSettingsAddCSV(state, payload)

    case MANAGER_FORMS_ADD:
      return managerFormsSettingsAddFormToCategory(payload)

    case MANAGER_FORMS_EDIT:
      return managerFormsSettingsEdit(payload)

    case MANAGER_FORMS_SET_CATEGORY_SELECTED:
      // tout peter
      let newState = [...payload.storage]
      newState[0].settings.formCategorySelected = payload.item
      saveLocalStorage(newState)
      return newState

    case MANAGER_FORMS_SELECTED_DELETE:
      return managerFormsSelectedDelete(payload)

    case MANAGER_FORMS_DELETE:
      return managerFormsSettingsDelete(state, payload)

    case LOAD_LOCALSTORAGE:
      return state
    default:
      return state;
  }
}

const deleteAllDatas = (payload) => {

  let newState = [...payload]
  newState[0].datas = []
  console.log(newState)
  saveLocalStorage(newState)
  return newState
}

const managerApplicantEdit = (payload) => {
  let newState = [...payload.storage]
  let datas = newState[0].datas

  let index = 0
  datas.forEach(element => {
    newState[0].datas[index].demandeur = payload.demandeur
    index++
  });

  newState[0].demandeur[payload.index] = payload.demandeur

  saveLocalStorage(newState)
  return newState
}

const managerAuditorEdit = (payload) => {
  let newState = [...payload.storage]
  let datas = newState[0].datas
  let index = 0
  datas.forEach(element => {
    newState[0].datas[index].auditeur = payload.auditeur
    index++
  });

  newState[0].auditeur[payload.index] = payload.auditeur

  saveLocalStorage(newState)
  return newState
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
  let newState = [...payload.storage]

  if (payload !== undefined) {
    let position = 0
    let index = 0
    for (let item of newState[0].datas) {
      if (item.gbook === payload.lastGbook) {
        position = index
      }
      index++
    }

    let newObj = {}
    let category = payload.newState.category
    for (let item in newState[0].forms) {
      let objState = newState[0].forms[`${item}`]
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
    newState[0].datas = updatePourcentForm(newState, { category: payload.newState.category })
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

  let index = 0
  for (let data of newState[0].datas) {
    if (data.category === payload.value) {
      newState[0].datas[index].audit = {}
      newState[0].datas[index].category = ""
      newState[0].datas[index].progress = 0
    }
    index++
  }

  saveLocalStorage(newState)
  return newState
}


const managerFormsSettingsAdd = (payload) => {
  let newState = [...payload.storage]
  newState[0].settings.allForms = [...newState[0].settings.allForms, payload.data]
  saveLocalStorage(newState)
  return newState
}

const managerFormsSettingsEdit = (payload) => {
  let newState = [...payload.storage]
  let forms = newState[0].forms

  let index = 0
  for (let category in forms) {
    for (let obj of forms[category]) {
      if (obj.name === payload.form.name) {
        newState[0].forms[category][index] = payload.form
        index = 0
        break
      }
      index++
    }
  }

  for (let form of newState[0].settings.allForms) {
    if (form.name === payload.form.name) {
      newState[0].settings.allForms[payload.formIndex] = payload.form
    }
  }

  saveLocalStorage(newState)
  return newState
}


const managerFormsSettingsDelete = (state, payload) => {
  let newState = [...payload.storage]
  let forms = newState[0].forms
  let formsAll = newState[0].settings.allForms

  let index = 0
  for (let category in forms) {
    for (let obj of forms[category]) {
      if (obj.name === payload.value) {
        newState[0].forms[category].splice(index, 1)
        index = 0
        break
      }
      index++
    }
  }
  newState[0].settings.allForms = formsAll.slice(0, payload.index).concat(formsAll.slice(payload.index + 1));
  saveLocalStorage(newState)
  return newState
}


const managerFormsSettingsAddCSV = (state, payload) => {
  let newState = [...payload.storage]
  newState[0].settings.allForms = [...newState[0].settings.allForms, ...payload.data]
  saveLocalStorage(newState)
  return newState
}


const managerFormsSettingsAddFormToCategory = (payload) => {
  let category = payload.category
  let newState = [...payload.storage]
  newState[0].forms[`${category}`] = payload.forms[`${category}`]
  newState[0].datas = updatePourcentForm(newState, payload)
  saveLocalStorage(newState)
  return newState
}

const managerFormsSelectedDelete = (payload) => {
  let newState = [...payload.storage]
  let category = payload.category
  let forms = newState[0].forms[`${category}`]

  newState[0].forms[`${category}`] = forms.slice(0, payload.index).concat(forms.slice(payload.index + 1));
  newState[0].datas = updatePourcentForm(newState, payload)


  saveLocalStorage(newState)
  return newState
}

const updatePourcentForm = (newState, payload) => {
  let category = payload.category
  let forms = newState[0].forms[`${category}`]
  forms = newState[0].forms[`${category}`].map(item => item.name)
  let allCards = newState[0].datas.filter(item => item.category === category)
  let datasFormNotCurrentCategory = newState[0].datas.filter(item => item.category !== category)
  let obj = {}
  let count = 0

  for (let data of allCards) {
    for (let item in data.audit) {
      if (forms.includes(item)) {
        obj[`${item}`] = data.audit[`${item}`]
      }
    }

    allCards[count].audit = obj
    allCards[count].progress = calculPourcentDoneForm(data.audit, forms)
    count++
  }

  return [...allCards, ...datasFormNotCurrentCategory]
}

const calculPourcentDoneForm = (numFormFill, numLabelForm) => {

  let numLabelFormSettings = numLabelForm?.length
  let numFormUser = Object.keys(numFormFill).length

  let fieldEmpty = 0
  for (let item in numFormFill) {
    if (numFormFill[item] === "") {
      fieldEmpty++
    }
  }
  numFormUser -= fieldEmpty
  return Math.round((numFormUser / numLabelFormSettings) * 100)
}


