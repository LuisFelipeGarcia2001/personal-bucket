class Cost {
  constructor(year, month, day, type, description, value) {
    this.year = year
    this.month = month
    this.day = day
    this.type = type
    this.description = description
    this.value = value
  }

  dataValidate() {
    for (let index in this) {
      if (this[index] == undefined || this[index] == '' || this[index] == null) {
        return false
      }
    }
    return true
  }
}

class Db {
  constructor() {
    let id = localStorage.getItem('id')

    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }

  getNextId() {
    let nextId = localStorage.getItem('id')
    return parseInt(nextId) + 1
  }

  registerOnStorage(c) {
    let id = this.getNextId()

    localStorage.setItem(id, JSON.stringify(c))
    localStorage.setItem('id', id)
  }

  recoverRegisters() {
    let costList = Array()
    let id = localStorage.getItem('id')

    for (let index = 1; index <= id; index++) {
      let cost = JSON.parse(localStorage.getItem(index))

      if (cost === null) {
        continue
      }
      cost.id = index
      costList.push(cost)
    }

    return costList
  }

  search(cost) {
    let filteredCosts = Array()
    filteredCosts = this.recoverRegisters()
    if (cost.year != '') {
      filteredCosts = filteredCosts.filter(c => c.year == cost.year)
    }
    if (cost.month != '') {
      filteredCosts = filteredCosts.filter(c => c.month == cost.month)
    }
    if (cost.day != '') {
      filteredCosts = filteredCosts.filter(c => c.day == cost.day)
    }
    if (cost.type != '') {
      filteredCosts = filteredCosts.filter(c => c.type == cost.type)
    }
    if (cost.description != '') {
      filteredCoss = filteredCosts.filter(c => c.description == cost.description)
    }
    if (cost.value != '') {
      filteredCosts = filteredCosts.filter(c => c.value == cost.value)
    }

    return filteredCosts
  }

  deleteCost(id) {
    localStorage.removeItem(id)
  }
}

let db = new Db()

//get cost elements
function registerCost() {
  let year = document.getElementById('year').value
  let month = document.getElementById('month').value
  let day = document.getElementById('day').value
  let type = document.getElementById('type').value
  let description = document.getElementById('description').value
  let value = document.getElementById('value').value

  let cost = new Cost(
    year,
    month,
    day,
    type,
    description,
    value
  )

  if (cost.dataValidate()) {
    //sucessful validate
    db.registerOnStorage(cost)
    document.getElementById('modal-title').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('modal-title-div').className = 'modal-header text-success'
    document.getElementById('modal-content').innerHTML = 'Despesa foi cadastrada com sucesso!'
    document.getElementById('modal-btn').innerHTML = 'Voltar'
    document.getElementById('modal-btn').className = 'btn btn-success'
    $('#modal-register-cost').modal('show')

    document.getElementById('year').value = document.getElementById('month').value = document.getElementById('day').value = document.getElementById('type').value = document.getElementById('description').value = document.getElementById('value').value = ''
  } else {
    //validation failed
    document.getElementById('modal-title').innerHTML = 'Erro na inclusão do registro'
    document.getElementById('modal-title-div').className = 'modal-header text-danger'
    document.getElementById('modal-content').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
    document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir'
    document.getElementById('modal-btn').className = 'btn btn-danger'
    $('#modal-register-cost').modal('show')
  }
}

function loadCostList(costList = Array()) {
  if (costList.length == 0) {
    costList = db.recoverRegisters()
  }

  const tableCostList = document.getElementById('costList')
  tableCostList.innerHTML = ''

  costList.forEach(function (cost) {
    let row = tableCostList.insertRow()
    row.insertCell(0).innerHTML = `${cost.day}/${cost.month}/${cost.year}`

    switch (cost.type) {
      case '1':
        cost.type = 'Alimentação'
        break
      case '2':
        cost.type = 'Educação'
        break
      case '3':
        cost.type = 'Lazer'
        break
      case '4':
        cost.type = 'Saúde'
        break
      case '5':
        cost.type = 'Transporte'
    }

    row.insertCell(1).innerHTML = `${cost.type}`
    row.insertCell(2).innerHTML = `${cost.description}`
    row.insertCell(3).innerHTML = `${cost.value}`

    //create delete button
    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `cost-id-${cost.id}`
    btn.onclick = function() {
      let id = this.id.replace('cost-id-', '')
      db.deleteCost(id)
      window.location.reload()
    }
    row.insertCell(4).append(btn)
  })
}

function searchCost() {
  let year = document.getElementById('year').value
  let month = document.getElementById('month').value
  let day = document.getElementById('day').value
  let type = document.getElementById('type').value
  let description = document.getElementById('description').value
  let value = document.getElementById('value').value
  document.getElementById('year').value = document.getElementById('month').value = document.getElementById('day').value = document.getElementById('type').value = document.getElementById('description').value = document.getElementById('value').value = ''

  let cost = new Cost(
    year,
    month,
    day,
    type,
    description,
    value
  )

  let costList = db.search(cost)

  this.loadCostList(costList)
}